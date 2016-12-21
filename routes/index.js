var express = require('express');
var passport = require('passport');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var request = require('request');
var User = require("../models/user").User;

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: 'http://localhost:3000/callback'
};

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/' }),
  function(req, res) {
    var user = new User({
      email: req.user._json.email,
      name: req.user._json.name,
      gender: req.user._json.gender,
      picture: req.user._json.picture,
      latitude: req.user._json.latitude,
      longitude: req.user._json.longitude,
      country: req.user._json.country
    })
    user.save(function (err) {
      if (err) console.log("error saving user: ", err)
      console.log('user saved to db');
      res.redirect(req.session.returnTo || '/polls');
    });
  });

router.get('/', function(req, res, next) {
  res.render('index', { env: env });
});

router.get('/login',function(req, res){
  res.render('login', { env: env });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/polls', ensureLoggedIn, function(req, res){
  request('http://elections.huffingtonpost.com/pollster/api/charts.json?topic=2016-president', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var polls = JSON.parse(body);
      res.render('polls', {env: env, user: req.user, polls: polls});
    } else {
      res.render('error');
    }
  })
})

router.get('/user', ensureLoggedIn, function(req, res, next) {
  User.findOne({email: req.user._json.email }, function(err, user) {
    console.log(user);
    res.render('user', { env: env, user: user });
  })
  
});

module.exports = router;