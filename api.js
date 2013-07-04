var UserModel = require('./model.js');

exports.createUser = function(user) {
    var new_user = new UserModel({
        name: user.username,
        password: user.password
    });
    new_user.save(function(err) {
        if(!err) {
            return console.log('created');
        } else {
            return console.log(err);
        }
    });
    return new_user;
};

exports.existsUser = function(username) {
    return UserModel.find(request.params.id, function(err, note) {
        if(!err) {
            return response.send(note);
        } else {
            return console.log(err);
        }
    });
};

// // insert new note
// exports.createNote = function(request, response) {
//     var note = new NoteModel({
//         text: request.body.text
//     });
//     note.save(function(err) {
//         if(!err) {
//             return console.log('created');
//         } else {
//             return console.log(err);
//         }
//     });
//     return response.send(note);
// };

// // get a single note by id
// exports.getNote = function(request, response) {
//     return NoteModel.findById(request.params.id, function(err, note) {
//         if(!err) {
//             return response.send(note);
//         } else {
//             return console.log(err);
//         }
//     });
// };

// // update a note
// exports.updateNote = function(request, response) {
//     return NoteModel.findById(request.params.id, function(err, note) {
//         note.text = request.body.text;
//         return note.save(function(err) {
//             if(!err) {
//                 console.log('note updated');
//             } else {
//                 console.log(err);
//             }
//             return response.send(note);
//         });
//     });
// };

// // delete a note
// exports.deleteNote = function(request, response) {
//     return NoteModel.findById(request.params.id, function(err, note) {
//         return note.remove(function(err) {
//             if(!err) {
//                 console.log('Note removed');
//                 return response.send('');
//             } else {
//                 console.log(err);
//             }
//         });
//     });
// };