var express = require('express');
var app = express();
var port = 8081;
app.use(express.static(__dirname + '/../'));
app.listen( process.env.PORT || port, function () {
  console.log('Smoothly listening on port ' +port+'!');
});