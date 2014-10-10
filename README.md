# express-json2csv

## PLEASE NOTE THAT THIS IS A WORK IN PROGRESS MODULE. EXPECT SYNTAX CHANGES FREQUENTLY WHILE I WORK THROUGH EDGE CASES AND REAL WORLD USES.

This is currently being tested in an application that has to create 500,000+ row csv files.

## Installation

```bash
$ npm install express-json2csv
```

## Adding to Express

```js
var express = require('express');
var json2csv = require('express-json2csv');

var app = express();

app.use(json2csv);
```

## Options

Option | Type | Default | Description
------ | ---- | ------- | -----------
includeHeader | Boolean | true | Include header columns
includeFooter | Boolean | false | Include footer columns

## Examples

```js
var express = require('express');
var json2csv = require('express-json2csv');

var app = express();

app.use(json2csv);

// mimicking a mongodb esque dataset
var data = [{
    _id: '5422d576df3d571846f7927a',
    name: 'John Doe',
    occupation: 'Doctor',
    age: '28',
    status: 'Single'
  }, {
    _id: '5422d576df3d571846f7927b',
    name: 'Mary Poppins',
    occupation: 'Nurse',
    age: '32',
    status: 'Divorced'
}];

// define the order of the columns and their labels here
var columns = [{
  prop: 'name',
  label: 'Name'
}, {
  prop: 'occupation',
  label: 'Occupation'
}, {
  prop: 'age',
  label: 'Age'
}, {
  prop: 'status',
  label: 'Current Status'
}]

app.get('/', function(req, res) {
  res.csv('filename', data, columns);
});
```

## Todo

- Finish tests

## License

[MIT](LICENSE)
