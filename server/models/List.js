var mongoose = require('mongoose');

var Item = new mongoose.Schema({
    name: String,
});

var listSchema = new mongoose.Schema({
    userId: String,
    items: [Item]
});

module.exports = mongoose.model('List', listSchema);
