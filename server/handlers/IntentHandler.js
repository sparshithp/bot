/**
 * Created by sparshithp on 10/19/16.
 */
var laundryIntent = require('./LaundryIntent');
var groceryIntent = require('./GroceryIntent');
var uberIntent = require('./UberIntent');

exports.handleIntent = function(intentWithSlots, callback) {
  var intent = intentWithSlots.intent;
    if(intent == "laundry") {
        var message = laundryIntent.handle(intentWithSlots.slots);
        callback(message);
    } else if(intent == "grocery") {
        var message = groceryIntent.handle(intentWithSlots.slots);
        callback(message);
    } else if (intent == "uber"){
        var message = uberIntent.handle(intentWithSlots.slots, function(message){
            console.log("message: "+ message);
            callback(message);
        });
    } else {
        callback("I dont know what you mean");
    }
};