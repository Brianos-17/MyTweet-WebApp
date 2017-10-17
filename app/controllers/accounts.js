'use strict';

exports.main = {
  auth: false,
  handler: function (req, res) {
    res.view('main', {
      title: 'Welcome to MyTweet'
    });
  },
};

exports.signUp = {
  auth: false,
  handler: function(req, res) {
    res.view('signup', {
      title: 'Sign Up for MyTweet'
    });
  },
};