var express = require('express');
var should = require('should');
var request = require('supertest');
var json2csv = require('./../');

var app = express();

describe('res.csv()', function() {
  before(function(done) {
    var data = [{
      id: '1',
      name: 'John Doe',
      status: 'Single',
      age: '24',
      occupation: 'Doctor'
    }, {
      id: '2',
      name: 'Foo Bar',
      status: 'Single',
      age: '24',
      occupation: 'Doctor'
    }, {
      id: '3',
      name: 'Mary Joe',
      status: 'Single',
      age: '24',
      occupation: 'Doctor'
    }];

    app.use(json2csv);

    app.get('/default', function(req, res) {
      res.csv('test', data, {
        excludes: ['id']
      });
    });

    app.listen(3030);
    done();
  });

  it('should export constructor', function(done) {
    json2csv.should.be.a.Function;

    done();
  });
});
