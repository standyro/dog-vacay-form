var express = require('express');
var app = express();
var router = express.Router();

app.use(express.static('dist'));

app.post('/address', function(req, res) {
  res.send(200);
});

app.post('/credit-card', function(req, res) {
  res.send(200);
});

app.listen(process.env.PORT || 3000);
