/*
 Some code borrowed from https://github.com/jaredhanson/passport-local/blob/master/examples/login/app.js,
 */

var express = require('express');
var app = express();
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var users = require('./users.js');

// simple logger
app.use(function (req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
});

app.use(express.static('../client/bin'));

app.configure(function () {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

passport.serializeUser(function (user, done) {
  console.log('serialize');
  console.log(user);
  if ((typeof user._id) !== 'undefined')
    done(null, user._id);

});

passport.deserializeUser(function (id, done) {
  users.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
      console.log('trying to find login for username:' + username + ' password:' + password);
      users.findByUsername({ username: username }, function (err, user) {
        if (err) {
          console.log('some kind of error.');
          return done(err);
        }
        var match = bcrypt.compareSync(password, user.password);
        if (!user || username !== user.username || !match) {
          console.log('invalid user or pass.');
          //console.log('tried '+username+'/'+password+' real '+user.username+'/'+user.password);
          return done(null, false, { message: 'Incorrect username or password.' });
        }
        console.log('login successful');
        console.log(user);
        return done(null, user);
      });
    }
));

app.get('/hello.txt', function (req, res) {
  req.session.lastPage = '/awesome';
  res.send('Hello World.');
});

app.get('/private.txt', ensureAuthenticated, function (req, res) {
  //res.render('account', { user: req.user });
  res.send("You can view the private page.");
});

app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err)
    }
    if (!user) {
      console.log('notify failed login.');
      //return res.redirect('/hello.txt')
      res.send({id: 0});
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      console.log('notify successful login.')
      res.send({id: user._id, username: user.username});
      //return res.redirect('/private.txt');
    });
  })(req, res, next);
});
;

app.get('/logout', function(req, res){
  req.logout();
  res.send({success: true});
});

app.get('/get-user', function(req, res){
  if (req.isAuthenticated()) {
    res.send({id: req.user._id, username: req.user.username});
  }
  else {
    res.send(null);
  }
});

app.get('/is-authenticated', function(req, res){
  res.send(req.isAuthenticated());
});

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/hello.txt')
}

app.listen(3000);
console.log('Listening on port 3000.');
