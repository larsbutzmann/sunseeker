// The data model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var noteSchema = new Schema({
    postdate: {type: Date, default: Date.now},
    text: {type: String, default: ''}
});

module.exports = mongoose.model('Note', noteSchema);