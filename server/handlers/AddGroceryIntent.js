/**
 * Created by sparshithp on 11/3/16.
 */
var List = require('../models/List');

exports.handle = function (slots, userId, callback) {
    List.findOne({userId: userId}, function (err, list) {
        if (err) {
            callback("We experienced an error");
        } else {
            if (!list || list.status != "open") {
                list = new List();
                list.userId = userId;
                list.status = "open";
                list.items = [];
            }
            var items = list.items;
            items.unshift({name: slots.item});
            list.save(function (err) {
                if (err) {
                    callback("We experienced an error");
                } else {
                    callback(slots.item + " was added to your groceries list");
                }
            });

        }
    });
};