'use strict';

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

exports.login = {
  auth: false,
  handler: function(req, res) {
    res.view('login', {
      title: "Log In to MyTweet"
    });
  },
};