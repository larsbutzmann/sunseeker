var application_root = __dirname,
    express = require("express"),
    expressValidator = require('express-validator'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    jade = require('jade'),
    LocalStrategy = require('passport-local').Strategy,
    api = require("./api.js");

var UserModel = require('./model.js');
var app = express();

// Configure server
app.configure(function() {
  app.set('views', __dirname + '/site/views');
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/site'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(expressValidator());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(app.router);
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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Auth
passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());


// Routes
app.get('/', ensureAuthenticated, function (req, res) {
  res.render('index', {
    title: "Sunseeker",
    active: "home",
    user: req.user});
});

app.get('/register', function(req, res) {
  res.render('register', { });
});

app.post('/register', function(req, res) {
  req.assert('username', 'Username is required').notEmpty();
  req.assert('password', 'Password is too short').len(6, 20);
  req.assert('password', 'Passwords do not match').equals(req.body.password_confirmation);

  var errors = req.validationErrors();

  if (!errors){
    UserModel.register(new UserModel({ username : req.body.username }), req.body.password, function(err, account) {
      if (err) {
        return res.render('register', { user : account });
      }
      res.redirect('/');
    });
  } else {
    res.render('register', {
      message: '',
      errors: errors
    });
  }
});

app.get('/login', function(req, res) {
  res.render('login', { user : req.user });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// API
app.get('/api', function (req, res) {
  response.send('API is running');
});
// app.get('/api/notes', api.getNotes);
// app.post('/api/notes', api.createNote);
// app.get('/api/notes/:id', api.getNote);
// app.put('/api/notes/:id', api.updateNote);
// app.delete('/api/notes/:id', api.deleteNote);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});