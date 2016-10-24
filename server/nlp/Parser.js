/**
 * Created by sparshithp on 10/19/16.
 */
var Context = require('../models/Context');
var apiai = require('apiai');

exports.parseIntent =function(userId, text, callback)
{
    var app = apiai("722956b34c424fc5b08b356ce4119e55");
    Context.findOne({userId: userId}, function(err, context){
        var options = {};
        if(context){
            options.contexts = context;
        }
        var request = app.textRequest(text, options);
        request.on('response', function (response) {
            console.log(response);
            var result = response.result;
            var isFulfilled = !result["actionIncomplete"];
            var context = result.context;
            var intent = result.action;
            var slots = {};
            var params = result.parameters;
            for (var key in params) {
                var val = params[key];
                if (val && val != "") {
                    slots[key] = val;
                }
            }


            var intentWithSlots = {
                isFulfilled: isFulfilled,
                intent: intent,
                slots: slots,
                context: context,
                message: result.fulfillment.speech
            };

            callback(intentWithSlots);
            if(!isFulfilled) {
                var context = new Context();
                context.userId = userId;
                context.context = context;
                context.save(function(err){
                    if(err){console.log(err)}
                });
            } else {
                Context.remove({userId: userId}, function(err){
                    if(err){console.log("error deleteing")}
                });
            }

        });

        request.on('error', function (error) {
            console.log(error);
        });

        request.end();
    });


};