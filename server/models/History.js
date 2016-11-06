/**
 * Created by sparshithp on 11/5/16.
 */
var mongoose = require('mongoose');

var HistorySchema = new mongoose.Schema({
    userId: String,
    chats: [{
        response : Boolean,
        text: String
    }]
});

module.exports = mongoose.model('History', HistorySchema);