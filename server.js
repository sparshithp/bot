var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');
var logger = require('morgan');
var cors = require('cors');
var http = require('http');
var intent = require('./server/controllers/Intent');

// Register models
require('./server/models/User');
//require('./server/models/Restaurant');

// Connect to database
mongoose.connect(config.MONGO_URI);

var app = express();

// Express config
app.set('port', process.env.PORT || 8080);
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './frontend')));

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}


// Routes
require('./server/routes')(app);
var server = http.createServer(app);

server.listen(8080);
console.log('Express server listening on port ' + app.get('port'));
/*
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
*/