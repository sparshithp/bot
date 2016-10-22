/**
 * Created by sparshg on 10/21/16.
 */
var request = require('request');

exports.handle = function (slots, callback) {
    var lat = 12.957859;
    var long = 77.715038;
    var APPID = '111fd0b5165706e6807b6c1dd4c2ba6e';
    var message = "We couldn't get you weather for that location";
    var dateString = slots.date;
    var city = slots["geo-city"];
    if (!dateString) {
        var queryType = "";
        if (!city) {
            queryType = 'lat=' + lat + '&lon=' + long;
        } else {
            queryType = 'q=' + city;
        }
        request('http://api.openweathermap.org/data/2.5/weather?' + queryType
            + '&APPID=' + APPID + '&units=metric', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                weatherResponse = JSON.parse(body);// Show the HTML for the Google homepage.
                if (weatherResponse && weatherResponse.main && weatherResponse.main.temp) {
                    var message = "Currently, its " + weatherResponse.main.temp + " degrees in " + weatherResponse.name;
                    callback(message);
                }
            }
        });

    } else {
        var date = new Date(dateString);
        var queryType = "";
        if (!city) {
            queryType = 'lat=' + lat + '&lon=' + long;
        } else {
            queryType = 'q=' + city;
        }
        console.log(queryType);
        request('http://api.openweathermap.org/data/2.5/forecast/daily?' + queryType
            + '&APPID=' + APPID + '&units=metric', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                weatherResponse = JSON.parse(body);// Show the HTML for the Google homepage.
                if (weatherResponse && weatherResponse.list && weatherResponse.list.length > 0) {
                    var tempDetails = getTempDetailsFromWeatherResponseForDate(date, weatherResponse);
                    var message = "Date requested is too far away";
                    if (tempDetails) {
                        var min = tempDetails.min;
                        var max = tempDetails.max;
                        message = weatherResponse.city.name + " will have a high of " + max + " degrees and" +
                            " a low of " + min + " degrees on " + date.toDateString();
                    }
                    callback(message);
                }
            }
        });
    }


};


function getTempDetailsFromWeatherResponseForDate(date, weatherResponse) {

    var weatherDailyForecastList = weatherResponse.list;
    for (var i = 0; i < weatherDailyForecastList.length; i++) {
        var tempDetails = weatherDailyForecastList[i].temp;
        var forecastDate = new Date(parseInt(weatherDailyForecastList[i].dt) * 1000);
        if (forecastDate.toDateString() == date.toDateString()) {
            return weatherDailyForecastList[i].temp;
        }
    }
    return null;
}