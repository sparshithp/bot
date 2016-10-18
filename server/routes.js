var path = require('path');
var qs = require('querystring');
var express = require('express');
var jwt    = require('jsonwebtoken');
var moment = require('moment');
var mongoose = require('mongoose');
var request = require('request');
var config = require('../config');
var User = mongoose.model('User');
var userController = require('./controllers/UserController');
var sockjs = require('sockjs');


module.exports = function(app){

    app.get('/api/me', ensureAuthenticated, function(req, res) {
        console.log(req.user);
        User.findById(req.user._id, function(err, user){
            res.send(user);
        });
    });

    app.put('/api/me', ensureAuthenticated, function(req, res){
        User.findById(req.user, function(err, user){
            if(!user){
                return res.status(400).send({ message: 'User not found' });
            }
            user.displayName = req.body.displayName || user.displayName;
            user.email = req.body.email || user.email;
            user.save(function(err){
                res.status(200).end();
            });
        });
    });

////////////////////////////////////////////////////////////////////////////////
// User ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

    app.post('/auth/login', userController.login);

    app.post('/auth/signup', userController.signup);

};




////////////////////////////////////////////////////////////////////////////////
// Login Required Middleware ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function ensureAuthenticated(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.TOKEN_SECRET, function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.user = decoded._doc;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });


    }
}
////////////////////////////////////////////////////////////////////////////////
// Generate JSON Web Token /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function createToken(req, user) {
  var payload = {
    iss: req.hostname,
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}