var express = require('express');
var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('dist'));

app.set('validate', true);

app.post('/address', function(req, res) {
  if (app.get('validate') === true) {
    res.send(200);
  } else {
    res.send(400)
  }
});

app.post('/credit-card', function(req, res) {
  if (app.get('validate') === true) {
    res.send(200);
  } else {
    res.send(400)
  }
});

app.post('/form-validation', function(req, res) {
  console.dir(req.body);

  if (req.body.validate === 'true') {
    app.set('validate', true);
    res.send(200);
  } else {
    app.set('validate', false);
    res.send(200);
  }
});

app.listen(process.env.PORT || 3000);
