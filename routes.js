var passport = require('passport'),
  api = require("./api.js"),
  UserModel = require('./model/user.js'),
  XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
  parseString = require('xml2js').parseString;

module.exports = function (app) {

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }

  // app.get('/', ensureAuthenticated, function (req, res) {
  app.get('/', function (req, res) {
    res.render('index', {
      active: "home",
      user: req.user
    });
  });

  app.get('/show', function (req, res) {
    res.render('index', {
      active: "home"
    });
  });

  app.get('/register', function(req, res) {
    res.render('register', {
      active: "home"
    });
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
    res.render('login', {
      active: "home"
    });
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

  app.get('/debug', function(req, res) {
    res.render('debug', {
      active: "home"
    });
  });

  app.get('/weatherdata', function(req, res) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        var options = {"explicitArray": false};
        parseString(this.responseText, options, function (err, result) {
          result = JSON.stringify(result.response.data.METAR);
          res.setHeader('Content-Length', result.length);
          res.setHeader("Content-Type", "application/json");
          res.end(result);
        });
      }
    };

    xhr.open("GET", "http://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=~de&hoursBeforeNow=1");
    xhr.send();
  });

  // API
  app.get('/api', function (req, res) {
    res.send('API is running');
  });
  app.get('/api/weather', api.getWeather);
  app.post('/api/weather', api.postWeather);
  // app.get('/api/notes/:id', api.getNote);
  // app.put('/api/notes/:id', api.updateNote);
  // app.delete('/api/notes/:id', api.deleteNote);
}