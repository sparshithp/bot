/**
 * Created by sparshithp on 10/19/16.
 */
var laundryIntent = require('./LaundryIntent');
var groceryIntent = require('./GroceryIntent');
var uberIntent = require('./UberIntent');
var weatherIntent = require('./WeatherIntent');
var menuIntent = require('./MenuIntent');
var orderIntent = require('./OrderIntent');

exports.handleIntent = function (intentWithSlots, callback) {
    var intent = intentWithSlots.intent;
    if (intent == "laundry") {
        var message = laundryIntent.handle(intentWithSlots.slots);
        callback(message);
    } else if (intent == "grocery") {
        var message = groceryIntent.handle(intentWithSlots.slots);
        callback(message);
    } else if (intent == "uber") {
        uberIntent.handle(intentWithSlots.slots, function (message) {
            console.log("message: " + message);
            callback(message);
        });
    } else if (intent == "weather") {
        weatherIntent.handle(intentWithSlots.slots, function (message) {
            console.log("message: " + message);
            callback(message);
        });
    } else if(intent == "menu") {
        menuIntent.handle(intentWithSlots.slots, function (message) {
            console.log("message: " + message);
            callback(message);
        });
    } else if(intent == "order") {
        if(!intentWithSlots.isFulfilled) {
            callback(intentWithSlots.message)
        }else {
            orderIntent.handle(intentWithSlots.slots, function (message) {
                console.log("message: " + message);
                callback(message);
            });
        }
    }
    else {
        callback("I dont know what you mean");
    }
};