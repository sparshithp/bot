/**
 * Created by sparshithp on 10/23/16.
 */

exports.handle = function(slots, callback) {
    console.log(slots);
    callback("Order placed with "+ slots.restaurant + " for " + slots.order);
};