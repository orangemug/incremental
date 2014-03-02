var browserify = require('browserify-middleware');
var express = require('express');
var app = express();

app.use('/app.js', browserify('./example/app.js'));
app.use("/", express.static(__dirname+"/example"));

app.listen(3000);
