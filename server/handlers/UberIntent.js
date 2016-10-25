/**
 * Created by sparshithp on 10/20/16.
 */
var Uber = require('node-uber');

exports.handle = function(slots, callback) {
    var dateTime = " ";
    var uber = new Uber({
        client_id: 'vGL7TW_0PomIhwqN-XWnVP648NxmX2nf',
        client_secret: '0RG4uw3gKPSHBo9wD28QDielvHn0r56Txr7oekbH',
        server_token: 'xVXCPrLvA4F8r2vqdPAGH2RIAPTb1lDU7wcQ519e',
        name: 'BotApp'
    });
    var message = "We couldnt find the information you were looking for";
    uber.estimates.getETAForLocation(12.957859, 77.715038, function(err, res){
        if(err) {
            message = "We had some trouble contacting uber";
        }
        var uberType = slots.uberType;
        var types = res.times;
        for(var i=0; i<types.length; i++) {
            var type = types[i];
            if(uberType == type.display_name) {
                message = "The nearest "+ uberType +" for you is " + type.estimate + " seconds away.";
            }
        }
        callback(message);
    });
};