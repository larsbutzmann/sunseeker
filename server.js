var application_root = __dirname,
    express = require("express"),
    mongoose = require('mongoose'),
    api = require("./api.js");

var app = express();

// Configure server
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.logger());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/site'));
    //Show all errors in development
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

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

// Routes
app.get('/api', function(request, response) {
    response.send('API is running');
});

// API
app.get('/api/notes', api.getNotes);
app.post('/api/notes', api.createNote);
app.get('/api/notes/:id', api.getNote);
app.put('/api/notes/:id', api.updateNote);
app.delete('/api/notes/:id', api.deleteNote);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});