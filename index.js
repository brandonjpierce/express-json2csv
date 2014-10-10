var arraystream = require('arraystream');
var _ = require('lodash');

var DEFAULTS = {
  includeHeader: true,
  includeFooter: false
};

function Json2Csv(app, fileName, data, columns, options) {
  this.express = app;
  this.fileName = fileName;
  this.columns = columns;
  this.dataStream = arraystream.create(data);
  this.settings = _.extend(DEFAULTS, options);

  this.init();
}


Json2Csv.prototype.init = function() {
  var _this = this;

  this.render(function(data) {
    _this.setHeaders();
    return _this.express.send(data);
  });
};

Json2Csv.prototype.setHeaders = function() {
  this.express.charset = 'utf-8';
  this.express.header('Content-Type', 'text/csv');
  this.express.header('Content-disposition', 'attachment; filename=' + this.fileName + '.csv');
};

Json2Csv.prototype.render = function(cb) {
  var columns = this.columns;
  var settings = this.settings;
  var props = _.pluck(columns, 'prop');
  var headers = _.pluck(columns, 'label');

  var rows = [];

  this.dataStream.on('data', function(data) {
    var row = [];

    _(columns).forEach(function(column, index) {
      var rowValue = data[column.prop];

      if (column.render) {
        rowValue = column.render(rowValue, data);
      }

      row.push(rowValue);
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

function expressMiddleware(fileName, data, options) {
  return new Json2Csv(this, fileName, data, options);
}

module.exports = function(req, res, next) {
  res.csv = expressMiddleware;
  next();
}
