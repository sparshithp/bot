/**
 * Created by sparshithp on 10/16/16.
 */
var Context = require('../models/Context');
var jwt  = require('jsonwebtoken');
var config = require('../../config');

exports.parse = function(req, conn) {

    var msg = req.message.toLowerCase();
    var token = req.token;
    if(!token) {
        return "Please login";
    } else {
        // verifies secret and checks exp
        jwt.verify(token, config.TOKEN_SECRET, function (err, decoded) {
            if (err) {
                conn.write("Please login");
            } else {
                var userId = decoded._doc._id;
                getContextAndReply(msg, conn, userId);
            }
        });
    }
};


function getContextAndReply(msg, conn, userId) {
    if(msg.includes("laundry")) {
        var context = new Context();
        context.userId = userId;
        context.intent = "laundry";
        context.save(function(err){
            if(err) {
                return conn.write("We had an error. Please try later");
            }
            conn.write("So you want to get laundry done. At what time?");
        });

    }else{
        conn.write("I dont understand");
    }

}