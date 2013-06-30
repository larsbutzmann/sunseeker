var application_root = __dirname,
    express = require("express"),
    mongoose = require('mongoose'),
    passport = require('passport'),
    jade = require('jade'),
    LocalStrategy = require('passport-local').Strategy,
    api = require("./api.js");

var app = express();

// Configure server
app.configure(function() {
  app.set('views', __dirname + '/site/views');
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/site'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
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

// Routes
app.get('/api', function (req, res) {
  response.send('API is running');
});

var users = [
    { id: 1, username: 'lars', password: '1234', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

app.get('/', ensureAuthenticated, function (req, res) {
  console.log(req.user);
  res.render('index', {
    title: 'Sunseeker',
    active: 'home',
    user: req.user
  });
});

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Auth
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      });
    });
  }
));

app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: false
  }), function (req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function (req, res){
  req.logout();
  res.redirect('/');
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