var express = require('express');
var app = express();
var router = express.Router();

app.use(express.static('dist'));

app.listen(process.env.PORT || 3000);
