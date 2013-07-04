var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

// var Note = new mongoose.Schema({
//     postdate: {type: Date, default: Date.now},
//     text: {type: String, default: ''}
// });

// module.exports = mongoose.model('Note', Note);

var User = new mongoose.Schema({
    email: {type: String, default: ''},
    signup_date: {type: Date, default: Date.now}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
