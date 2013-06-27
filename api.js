var Note = require('./model.js');

Note.remove({}, function(err) {
  if (err) {
    console.log ('error deleting old data.');
  }
});

exports.addNote = function(req, res) {
    console.log(req.body);
    new Note({text: req.body.text}).save();
    res.send("here");
};

exports.listNotes = function(req, res) {
    Note.find(function(err, notes) {
        res.send(notes);
    });
};

exports.login = function(req, res) {
    res.render("new.html", {});
};

test = function(t) {
    console.log("HEREEEEEEE");
};