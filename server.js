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
app.use(express.static(path.join(__dirname, './public')));

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}

var sockjs = require('sockjs');

var connections = [];

var chat = sockjs.createServer();

chat.on('connection', function(conn) {
  connections.push(conn);
  var number = connections.length;
  conn.write("Welcome, User " + number);
  conn.on('data', function(message) {
    var req = JSON.parse(message);
    intent.parse(req, conn);
  });
  conn.on('close', function() {
    for (var ii=0; ii < connections.length; ii++) {
      connections[ii].write("User " + number + " has disconnected");
    }
  });
});

// Routes
require('./server/routes')(app);
var server = http.createServer(app);

chat.installHandlers(server, {prefix:'/chat'});

server.listen(8080);
/*
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
*/