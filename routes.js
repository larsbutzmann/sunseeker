var passport = require('passport'),
    api = require("./api.js");
    UserModel = require('./model.js');

module.exports = function (app) {

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
  }

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
    res.render('login', {
      active: "home",
      user : req.user
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

  // API
  app.get('/api', function (req, res) {
    response.send('API is running');
  });
  // app.get('/api/notes', api.getNotes);
  // app.post('/api/notes', api.createNote);
  // app.get('/api/notes/:id', api.getNote);
  // app.put('/api/notes/:id', api.updateNote);
  // app.delete('/api/notes/:id', api.deleteNote);

}