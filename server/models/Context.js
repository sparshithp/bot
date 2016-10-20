/**
 * Created by sparshithp on 10/16/16.
 */
var mongoose = require('mongoose');

var contextSchema = new mongoose.Schema({
    userId: String,
    intent: String,
    slots: Object
});

module.exports = mongoose.model('Context', contextSchema);