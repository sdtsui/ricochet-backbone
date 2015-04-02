var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/',express.static(__dirname));

var port = process.env.PORT || 8080;
console.log("Listening on Port : " ,port);
app.listen(port);