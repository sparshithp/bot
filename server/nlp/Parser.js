/**
 * Created by sparshithp on 10/19/16.
 */
var Context = require('../models/Context');
var apiai = require('apiai');

exports.parseIntent =function(userId, text, callback)
{
    var app = apiai("722956b34c424fc5b08b356ce4119e55");

    var request = app.textRequest(text);
    request.on('response', function (response) {
        console.log(response);
        var result = response.result;
        var intent = result.action;
        var slots = {};
        var params = result.parameters;
        for (var key in params) {
            var val = params[key];
            if (val && val != "") {
                slots[key] = val;
            }
        }
        var context = new Context();
        if (intent == "input.unknown") {
            context.userId = userId;
            context.intent = intent;
            context.slots = slots;
            context.save(function (err) {
                if (err) {
                }
            })
        }
        var intentWithSlots = {
            intent: intent,
            slots: slots
        };
        callback(intentWithSlots);
    });

    request.on('error', function (error) {
        console.log(error);
    });

    request.end();
};