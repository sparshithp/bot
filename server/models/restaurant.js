/**
 * Created by sparshithp on 10/23/16.
 */
var mongoose = require('mongoose');

var restaurantSchema = new mongoose.Schema({
    resName: String,
    menus: [String],
    area: String
});

module.exports = mongoose.model('Restaurant', restaurantSchema);