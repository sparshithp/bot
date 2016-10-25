var jwt = require('jsonwebtoken');
var moment = require('moment');
var mongoose = require('mongoose');
var config = require('../config');
var User = mongoose.model('User');
var Restaurant = require('./models/restaurant');
var userController = require('./controllers/UserController');
var nlpParser = require('./nlp/parser');
var handler = require('./handlers/IntentHandler');

module.exports = function (app) {

    app.get('/api/me', ensureAuthenticated, function (req, res) {
        console.log(req.user);
        User.findById(req.user._id, function (err, user) {
            res.send(user);
        });
    });

    app.put('/api/me', ensureAuthenticated, function (req, res) {
        User.findById(req.user, function (err, user) {
            if (!user) {
                return res.status(400).send({message: 'User not found'});
            }
            user.displayName = req.body.displayName || user.displayName;
            user.email = req.body.email || user.email;
            user.save(function (err) {
                res.status(200).end();
            });
        });
    });

////////////////////////////////////////////////////////////////////////////////
// User ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

    app.post('/auth/login', userController.login);

    app.post('/auth/signup', userController.signup);

    app.post('/parse', ensureAuthenticated, function (req, res) {
        console.log(req.user);
        var text = req.body.text;
        var userId = req.body.userId;
        if (!text || text == "") {
            res.status(400).send({
                message: "No Text"
            });
        } else if (!userId) {
            res.status(400).send({
                message: "No User"
            });
        } else {
            var intentWithSlots = nlpParser.parseIntent(userId, text, function(intentWithSlots){
                var returnMsg = handler.handleIntent(intentWithSlots, function(returnMsg){
                    console.log(returnMsg);
                    res.status(200).send(returnMsg);
                });
            });

        }
    });

    app.post('/restaurant/add',function(req, res){
        var restaurantName = req.body.resName;
        var menus = req.body.menus;
        var area = req.body.area;
        var restaurant = new Restaurant();
        restaurant.resName = restaurantName.toLowerCase();
        restaurant.menus = menus;
        restaurant.area = area;
        restaurant.save(function(err){
            if(err){
                return res.status(400).send({
                    message : "error"
                });
            }
            return res.status(200).send({
                message : "successful"
            });
        });

    });

};


////////////////////////////////////////////////////////////////////////////////
// Login Required Middleware ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function ensureAuthenticated(req, res, next) {
    // check header or url parameters or post parameters for token
  //  var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    if (!req.header('Authorization')) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.header('Authorization').split(' ')[1];
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