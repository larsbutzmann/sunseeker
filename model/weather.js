var mongoose = require('mongoose');

var Weather = new mongoose.Schema({
    timestamp: {type: Date, default: Date.now},
    latitude: {type: Number, default: 0},
    longitude: {type: Number, default: 0},
    type: {type: String}
});

module.exports = mongoose.model('Weather', Weather);
