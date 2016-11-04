var mongoose = require('mongoose');

var Item = new mongoose.Schema({
    name: String
});

var listSchema = new mongoose.Schema({
    userId: String,
    items: [Item],
    status: String
});

module.exports = mongoose.model('List', listSchema);
