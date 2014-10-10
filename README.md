# express-json2csv

#### PLEASE NOTE THAT THIS IS A WORK IN PROGRESS MODULE. EXPECT SYNTAX CHANGES FREQUENTLY WHILE I WORK THROUGH EDGE CASES AND REAL WORLD USES.

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
## Syntax

```js
res.csv(filename, data, columns, [options]);
```

#### Filename
This can be any string you wish. The `.csv` extension is automatically appended to the filename so it is not required.

#### Data
```js
Type: Array
```
Data is a required argument. The columns prop property will reference the keys in each of the data objects you pass in to define the order.

#### Columns
```js
Type: Array
```
Columns is a required argument and will define the order / rendering of your CSV file. You must provide at least the label and prop attribute for each column. There is also a optional render attribute you can pass if you want to mutate your data before rendering it to the CSV.

```js
var columns = [{
  prop: 'column1',
  label: 'First Column',
  render: function(data, row) {
    return data + ' rendered content!';
  }
}, {
  prop: 'column2',
  label: 'Second Column'
}];
```

#### Options

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
  label: 'Name',
  render: function(data, row) {
    return data + ', US citizen';
  }
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
