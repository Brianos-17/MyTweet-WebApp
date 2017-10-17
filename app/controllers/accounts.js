'use strict';

const User = require('../models/user');

exports.main = {
  auth: false,
  handler: function (req, res) {
    res.view('main', {
      title: 'Welcome to MyTweet'
    });
  },
};

exports.signup = {
  auth: false,
  handler: function(req, res) {
    res.view('signup', {
      title: 'Sign Up for MyTweet'
    });
  },
};

exports.register = {
  auth: false,
  handler: function(req, res) {
    const user = new User(req.payload);
    user.save().then(newUser => {
      res.redirect('/login');
    }).catch(err => {
      res.redirect('/');
      console.log('Error registering new user: ' + err);
    });
  },
};

exports.login = {
  auth: false,
  handler: function(req, res) {
    res.view('login', {
      title: "Log In to MyTweet"
    });
  },
};