var _ = require('lodash');

var DEFAULTS = {
  includeHeader: true,
  includeFooter: false,
  columns: null
};

function Json2Csv(app, fileName, data, options) {
  this.express = app;
  this.fileName = fileName;
  this.jsonData = data;
  this.settings = _.extend(DEFAULTS, options);

  this.init();
}


Json2Csv.prototype.init = function() {
  var body = this.render(this.jsonData);
  this.setHeaders();

  return this.express.send(body);
};

Json2Csv.prototype.setHeaders = function() {
  this.express.charset = this.charset || 'utf-8';
  this.express.header('Content-Type', 'text/csv');
  this.express.header('Content-disposition', 'attachment; filename=' + this.fileName + '.csv');
};

Json2Csv.prototype.getColumns = function() {
  // if columns are set in settings use those instead
  if (this.settings.columns) {
    return this.settings.columns;
  }

  var columns = [];
  var excludes = this.settings.excludes;

  for (var i = 0, len = this.jsonData.length; i != len; i++) {
    var data = this.jsonData[i];

    // we need to check if our object contains an excluded key
    // if so we remove if from the object altogether
    if (excludes) {
      _(data).forEach(function(val, key) {
        if (_.contains(excludes, key)) {
          delete data[key];
        };
      });
    }

    columns = _.union(columns, _.keys(data));
  }

  return columns;
};

Json2Csv.prototype.render = function() {
  var rows = [];
  var columns = this.getColumns();
  var excludes = this.settings.excludes;

  if (this.settings.includeHeader) {
    rows.push(columns);
  }

  for (var i = 0, len = this.jsonData.length; i != len; i++) {
    var row = [];

    _(this.jsonData[i]).forEach(function(value, key) {
      if (!_.contains(excludes, key)) {
        row.push(value);
      }
    });

    rows.push(row);
  }

  if (this.settings.includeFooter) {
    rows.push(columns);
  }

  return JSON.stringify(rows)
    .replace(/],\[/g, '\n')
    .replace(/]]/g, '')
    .replace(/\[\[/g, '');
};

function expressMiddleware(fileName, data, options) {
  return new Json2Csv(this, fileName, data, options);
}

module.exports = function(req, res, next) {
  res.csv = expressMiddleware;
  next();
}
