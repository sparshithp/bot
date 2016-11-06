/**
 * Created by sparshithp on 11/5/16.
 */
var History = require('../models/History');

exports.addChat = function (req, res) {
    var userId = req.user._id;
    var isResponse = req.body.isResponse;
    var text = req.body.text;
    History.findOne({userId: userId}, function (err, history) {
        if (err || !text || /^\s*$/.test(text)) {
            res.status(400).send({
                message: "We experienced an error"
            });
        }
        if (!history) {
            history = new History({userId: userId});
            history.chats = [];
        }
        history.chats.push({
            response: isResponse,
            text: text
        });
        history.save(function (err) {
            if (err) {
                res.status(400).send({
                    message: "We experienced an error"
                });
            } else {
                res.status(400).send({
                    chats: history.chats
                });
            }
        });
    });
};



exports.get = function(req, res){
    var userId = req.user._id;
    History.findOne({userId: userId}, function(err, history){
        if(err){
            res.status(400).send({
                message: "We experienced an error"
            });
        }else if(!history){
            res.status(200).send({
                chats : []
            });
        } else {
            res.status(200).send({
                chats : history.chats
            });
        }
    });
};