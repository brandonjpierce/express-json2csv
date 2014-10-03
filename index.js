var arraystream = require('arraystream');
var _ = require('lodash');

var DEFAULTS = {
  includeHeader: true,
  includeFooter: false,
  columns: null
};

function Json2Csv(app, fileName, data, options) {
  this.express = app;
  this.fileName = fileName;
  this.dataStream = arraystream.create(data);
  this.settings = _.extend(DEFAULTS, options);

  this.init();
}


Json2Csv.prototype.init = function() {
  var _this = this;

  _this.render(function(data) {
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
  var columns = [];
  var rows = [];
  var settings = this.settings;
  var excludes = settings.excludes;

  this.dataStream.on('data', function(data) {
    var row = [];

    _(data).forEach(function(value, key) {
      if (excludes) {
        if (_.contains(excludes, key)) {
          delete data[key];
        } else {
          row.push(value);
        }
      } else {
        row.push(value);
      }
    });

    columns = settings.columns ?
      settings.columns :
      _.union(columns, _.keys(data));

    rows.push(row);
  });

  this.dataStream.on('end', function() {
    if (settings.includeHeader) {
      rows.unshift(columns);
    }

    if (settings.includeFooter) {
      rows.push(columns);
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
