# express-json2csv


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
excludes | Array | null | An array of items you wish to exclude from the generated CSV.
columns | Array | null | Specify the column headers you wish to include. Note: this is only useful if you know the exact order your data and want to modify the output of the column header / footer text.
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

app.get('/', function(req, res) {
  res.csv('filename', data, {
    excludes: ['_id'] // we do not want to include the _id field in our CSV
  });
});
```

## Todo

- Finish tests

## License

[MIT](LICENSE)
