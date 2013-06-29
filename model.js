var mongoose = require('mongoose');

var Note = new mongoose.Schema({
    postdate: {type: Date, default: Date.now},
    text: {type: String, default: ''}
});

module.exports = mongoose.model('Note', Note);
