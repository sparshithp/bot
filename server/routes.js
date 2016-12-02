var jwt = require('jsonwebtoken');
var moment = require('moment');
var mongoose = require('mongoose');
var config = require('../config');
var User = mongoose.model('User');
var Restaurant = require('./models/restaurant');
var userController = require('./controllers/UserController');
var listController = require('./controllers/List');
var parseController = require('./controllers/parse');
var handler = require('./handlers/IntentHandler');
var historyController = require('./controllers/History');
var request = require('request');

module.exports = function (app) {

    app.get('/', function(req, res){
        res.sendFile('index.html', {root: 'frontend'});
    });

    app.get('/webhook', function (req, res) {
        if (req.query['hub.verify_token'] === 'snag') {
            return res.send(req.query['hub.challenge'])
        }
        res.send('Error, wrong token')
    });

    app.post('/webhook', function (req, res) {
        var data = req.body;

        // Make sure this is a page subscription
        if (data.object === 'page') {

            // Iterate over each entry - there may be multiple if batched
            data.entry.forEach(function(entry) {
                var pageID = entry.id;
                var timeOfEvent = entry.time;

                // Iterate over each messaging event
                entry.messaging.forEach(function(event) {
                    if (event.message) {
                        receivedMessage(event);
                    } else {
                        console.log("Webhook received unknown event: ", event);
                    }
                });
            });

            // Assume all went well.
            //
            // You must send back a 200, within 20 seconds, to let us know
            // you've successfully received the callback. Otherwise, the request
            // will time out and we will keep trying to resend.
            res.sendStatus(200);
        }
    });

    function receivedMessage(event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfMessage = event.timestamp;
        var message = event.message;

        console.log("Received message for user %d and page %d at %d with message:",
            senderID, recipientID, timeOfMessage);
        console.log(JSON.stringify(message));

        var messageId = message.mid;

        var messageText = message.text;
        var messageAttachments = message.attachments;

        if (messageText) {

            // If we receive a text message, check to see if it matches a keyword
            // and send back the example. Otherwise, just echo the text we received.
            switch (messageText) {
                case 'generic':
                    sendGenericMessage(senderID);
                    break;

                default:
                    sendTextMessage(senderID, messageText);
            }
        } else if (messageAttachments) {
            sendTextMessage(senderID, "Message with attachment received");
        }
    };

    function sendGenericMessage(recipientId) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [{
                            title: "rift",
                            subtitle: "Next-generation virtual reality",
                            item_url: "https://www.oculus.com/en-us/rift/",
                            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
                            buttons: [{
                                type: "web_url",
                                url: "https://www.oculus.com/en-us/rift/",
                                title: "Open Web URL"
                            }, {
                                type: "postback",
                                title: "Call Postback",
                                payload: "Payload for first bubble",
                            }],
                        }, {
                            title: "touch",
                            subtitle: "Your Hands, Now in VR",
                            item_url: "https://www.oculus.com/en-us/touch/",
                            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
                            buttons: [{
                                type: "web_url",
                                url: "https://www.oculus.com/en-us/touch/",
                                title: "Open Web URL"
                            }, {
                                type: "postback",
                                title: "Call Postback",
                                payload: "Payload for second bubble",
                            }]
                        }]
                    }
                }
            }
        };

        callSendAPI(messageData);
    }

    function sendTextMessage(recipientId, messageText) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText
            }
        };

        callSendAPI(messageData);
    }

    var PAGE_ACCESS_TOKEN = "EAAZAZAEAfDnKwBAME68Yz8KHxSolNlsVBbcxHZC05AzSSHLWGyPShesNoXePpy73eXWQDIZCbMd81kGRxZB25QkR1Dxl1rezROxKteZCp33bXS8nlTcqiZB4VlZCNU7abS4kvFZBivClxGdBby0DitdpDSR489ibWw65ZBH1ShUQ20rAZDZD";

    function callSendAPI(messageData) {
        request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: messageData

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var recipientId = body.recipient_id;
                var messageId = body.message_id;

                console.log("Successfully sent generic message with id %s to recipient %s",
                    messageId, recipientId);
            } else {
                console.error("Unable to send message.");
                console.error(response);
                console.error(error);
            }
        });
    }















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

    app.post('/parse', ensureAuthenticated, parseController.parse);

    app.get('/history/get', ensureAuthenticated, historyController.get);

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

    app.get('/list/get', ensureAuthenticated, listController.get);

    app.post('/list/add', ensureAuthenticated, listController.add);

    app.post('/list/addItem', ensureAuthenticated, listController.addItem);

    app.post('/list/deleteItem', ensureAuthenticated, listController.deleteItem);

    app.post('/list/editItem', ensureAuthenticated, listController.editItemById);

    app.get('/list/checkout', ensureAuthenticated, listController.checkout);



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