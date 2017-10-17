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
      console.log('New user registered: ' + newUser.firstName +
          ' ' + newUser.lastName);
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

exports.authenticate = {
  auth: false,
  handler: function (req, res) {
    const user = req.payload;
    User.findOne({email: user.email}).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        req.cookieAuth.set({
          loggedIn: true,
        loggedInUser: user.email,
        });
        res.redirect('/dashboard');
      } else {
        res.redirect('/login');
      }
    }).catch(err => {
      console.log('Error logging in: ' + err);
      res.redirect('/');
    });
  },
};

exports.logout = {
  auth: false,
  handler: function(req,res) {
    req.cookieAuth.clear();
    res.redirect('/');
  },
};

exports.account = {
  handler: function(req, res) {
    const userEmail = req.auth.credentials.loggedInUser;
    User.findOne({email: userEmail}).then(currentUser => {
      res.view('settings', {
        title: 'Account Settings',
        user: currentUser,
      });
    }).catch(err => {
      console.log('Error access account settings: ' + err);
      res.redirect('/home');
    });
  },
};