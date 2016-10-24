/**
 * Created by sparshithp on 10/23/16.
 */
var Restaurant = require('../models/restaurant');
exports.handle = function(slots, callback) {
    var restaurantName = slots.restaurant;
    if(!restaurantName) {
        callback("Please specify the restaurant name that we support in the query");
    }else{
        restaurantName = restaurantName.toLowerCase().replace(String.fromCharCode(160), " ");
        var query = {
            resName : restaurantName
        };
        console.log('biryani zone');
        Restaurant.findOne(query, function(err, res){
            console.log(res);
            if(err) {
                callback("We experienced an error. Please try again later");
            }else if(!res){
                callback("Please specify the restaurant name that we support");
            }else{
                var menus = res.menus;
                callback("Here is the menu(s) for "+ restaurantName +"\n " + menus);
            }
        })
    }
};