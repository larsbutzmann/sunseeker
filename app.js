var express = require("express"),
    mongo = require('mongodb'),
    mongoose = require('mongoose'),
    consolidate = require("consolidate"),
    Handlebars = require("handlebars"),
    fs = require("fs"),
    api = require("./api.js");

var app = express();

// MongoDB
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/mydb';

mongoose.connect(mongoUri, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + mongoUri + '. ' + err);
  } else {
    console.log ('Succeeded connection to: ' + mongoUri);
  }
});

// Configure the Handlebars engine
app.engine("html", consolidate.handlebars);
app.set("view engine", "html");
app.set("views", __dirname + "/views");

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

// Register partials
var partials = "./views/partials/";
fs.readdirSync(partials).forEach(function (file) {
    var source = fs.readFileSync(partials + file, "utf8"),
        partial = /(.+)\.html/.exec(file).pop();

    Handlebars.registerPartial(partial, source);
});

// mongo.Db.connect(mongoUri, function (err, db) {
//   db.collection('mydocs', function(er, collection) {
//     collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
//     });
//   });
// });

// Define a route that renders the index view
app.get("/", function (req, res) {
    res.render("index.html", {});
});

app.post('/addNote', api.addNote);
app.get('/getNotes', api.listNotes);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});