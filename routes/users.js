var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'});
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('users - get');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'register'});
});

router.post('/register', upload.single('profileimage'), function(req, res, next) {
  var name     = req.body.name;
  var email    = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  var profileImage = 'noimage.jpg';
  if (req.file) {
    console.log('Uploading file...');
    profileImage = req.file.filename;
  } else {
    console.log('No file uploaded');
  }

  // form validation
  req.checkBody('name', 'name field is required').notEmpty();
  req.checkBody('email', 'email field is required').notEmpty();
  req.checkBody('email', 'email field must be valid').isEmail();
  req.checkBody('username', 'username field is required').notEmpty();
  req.checkBody('password', 'password field is required').notEmpty();
  req.checkBody('password2', 'password2 field is required').notEmpty();
  req.checkBody('password2', 'password do not match').equals(password);

  //check errors
  var errors = req.validationErrors();
  if (errors) {
    res.render('register', {errors: errors});
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileImage: profileImage
    });
    User.createUser(newUser, (err) => {
      if(err) {
        throw err;
      }
    });

    req.flash('success', 'you are registered and now can login');

    res.location('/');
    res.redirect('/');
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'login'});
});

router.post('/login', passport.authenticate('local', 
              {failureRedirect: '/users/lsogin', failureFlash: 'Inavlid username or password'}), 
              function(req, res) {
  req.flash('success', 'You are now logged in');
  res.redirect('/');
});

passport.use(new localStrategy((username, password, done) => {
  User.getUserByUsername(username, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      return done(null, false, {message: 'Unknown user'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        done(err);
      }
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid password'});
      }
    });
  });
}));

router.get('/logout', function(req, res, next) {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;
