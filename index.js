/**
 * Module dependecies
 */
var arraystream = require('arraystream');
var _ = require('lodash');

/**
 * Default settings
 * @type {Object}
 */
var DEFAULTS = {
  includeHeader: true,
  includeFooter: false
};

/**
 * Module contructor
 * @param {Object} app      Express object to attach middleware to
 * @param {String} filename The filename of the CSV (extension auto appended)
 * @param {Array}  data     Array of objects to add to the CSV
 * @param {Array}  columns  Array of objects that defines structure of CSV
 * @param {Object} options  Optional settings for the CSV
 */
function Json2Csv(app, filename, data, columns, options) {
  this.settings = _.extend(DEFAULTS, options);
  this.express = app;
  this.filename = filename;
  this.columns = columns;

  // create our Stream
  this.dataStream = arraystream.create(data);

  this.init();
}

/**
 * Initialize our render function and hook into express's send method
 * to send out the formatted CSV
 * @return {[Attachment]} The rendered CSV file as a attachment
 */
Json2Csv.prototype.init = function() {
  var _this = this;

  // REMINDER: find out why .bind(this) does not work here...
  this.render(function(data) {
    _this.setHeaders();
    return _this.express.send(data);
  });
};

/**
 * Set headers for our express response
 */
Json2Csv.prototype.setHeaders = function() {
  this.express.charset = 'utf-8';
  this.express.header('Content-Type', 'text/csv');
  // auto append the .csv extension so people dont do crazy things
  this.express.header('Content-disposition', 'attachment; filename=' + this.filename + '.csv');
};

/**
 * Stream through the data and parse each row. Once the data has ended we format
 * the data to be used in a CSV
 * @param  {Function} cb Callback function once the CSV has been rendered
 * @return {Object}      Formatted JSON that we use for CSV data
 */
Json2Csv.prototype.render = function(cb) {
  var columns = this.columns;
  var settings = this.settings;

  // pluck out the headers so we can append / unshift them later
  var headers = _.pluck(columns, 'label');
  var rows = [];

  this.dataStream.on('data', function(data) {
    var row = [];

    // cycle through the columns so that our order defined in the columns array
    // is kept and we can mutate any items if need be
    _(columns).forEach(function(column, index) {
      var value = data[column.prop];

      if (column.render) {
        // notice we pass the entire row of data as second argument
        value = column.render(value, data);
      }

      row.push(value);
    });

    rows.push(row);
  });

  this.dataStream.on('end', function() {
    if (settings.includeHeader) {
      rows.unshift(headers);
    }

    if (settings.includeFooter) {
      rows.push(headers);
    }

    var data = JSON.stringify(rows)
      .replace(/],\[/g, '\n')
      .replace(/]]/g, '')
      .replace(/\[\[/g, '');

    cb(data);
  });
};

/**
 * Factory method for express middleware
 * @param {String} filename The filename of the CSV (extension auto appended)
 * @param {Array}  data     Array of objects to add to the CSV
 * @param {Array}  columns  Array of objects that defines structure of CSV
 * @param {Object} options  Optional settings for the CSV
 */
function expressMiddleware(filename, data, columns, options) {
  return new Json2Csv(this, filename, data, columns, options);
}

/**
 * Actual middleware hook for express
 * @param  {Object}   req  Express request object
 * @param  {Object}   res  Express response object
 * @param  {Function} next Express next function
 * @return {Function}      Hook .csv method into express res object
 */
module.exports = function(req, res, next) {
  res.csv = expressMiddleware;
  next();
}
