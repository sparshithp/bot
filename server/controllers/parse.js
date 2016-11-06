/**
 * Created by sparshithp on 11/5/16.
 */
var History = require('../models/History');
var nlpParser = require('../nlp/Parser');
var handler = require('../handlers/IntentHandler');


exports.parse = function (req, res) {
    console.log(req.user._id);
    var text = req.body.text;
    var userId = req.user._id;
    if (!text || text == "") {
        res.status(400).send({
            message: "No Text"
        });
    } else {
        History.findOne({userId: userId}, function (err, history) {
            if (err) {
                res.status(400).send({
                    message: "We experienced an error"
                });
            }
            if (!history) {
                history = new History({userId: userId});
                history.chats = [];
            }
            history.chats.push({
                response: false,
                text: text
            });
            history.save(function (err) {
                if (err) {
                    res.status(400).send({
                        message: "We experienced an error"
                    });
                } else {
                    nlpParser.parseIntent(userId, text, function (intentWithSlots) {
                        handler.handleIntent(intentWithSlots, userId, function (returnMsg) {
                            history.chats.push({
                                response: true,
                                text: returnMsg
                            });
                            history.save(function (err) {
                                if (err) {
                                    res.status(400).send({
                                        message: "We experienced an error"
                                    });
                                }
                                console.log(returnMsg);
                                res.status(200).send(returnMsg);
                            })

                        });
                    });
                }
            });
        });
    }
};
