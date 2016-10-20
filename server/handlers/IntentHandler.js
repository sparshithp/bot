/**
 * Created by sparshithp on 10/19/16.
 */
var laundryIntent = require('./LaundryIntent');

exports.handleIntent = function(intentWithSlots) {
  var intent = intentWithSlots.intent;
    if(intent == "laundry") {
        var message = laundryIntent.handle(intentWithSlots.slots);
        return message;
    } else {
        return "I dont know what you mean";
    }
};