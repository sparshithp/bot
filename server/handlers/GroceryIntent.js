/**
 * Created by sparshithp on 10/20/16.
 */

exports.handle = function(slots) {
    var dateTime = " ";
    if(slots.date){
        var dateObject = new Date(Date.parse(slots.date));
        var day = dateObject.toDateString();
        dateTime += "on " + day;
    }
    if(slots.time){
        var timeSplit = slots.time.split(":");
        var dateObject = new Date(0,0,0,timeSplit[0],timeSplit[1],timeSplit[2],0);
        var hours = dateObject.toLocaleTimeString();
        dateTime += "at " + hours;
    }
    return "Worry not!! We will make sure you get your groceries"+dateTime;
};