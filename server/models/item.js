var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Item', itemSchema);