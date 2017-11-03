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
    const userType = 'user';
    res.view('signup', {
      title: 'Sign Up for MyTweet',
      userType: userType //Used for check in register method
    });
  },
};

exports.register = {
  auth: false,
  handler: function(req, res) {
    const userType = req.params.userType;
    const user = new User(req.payload);
    user.save().then(newUser => {
      console.log('New user registered: ' + newUser.firstName +
          ' ' + newUser.lastName);
      if(userType === 'admin') {
        res.redirect('/adminDashboard')
      } else{
        res.redirect('/login');
      }
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
        if (foundUser.admin){
          res.redirect('/adminDashboard');
        } else {
          res.redirect('/dashboard');
        }
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
      res.view('account', {
        title: 'Account Settings',
        user: currentUser,
      });
    }).catch(err => {
      console.log('Error access account settings: ' + err);
      res.redirect('/home');
    });
  },
};

exports.updateAccount = {
  handler: function (req, res) {
    const userEmail = req.auth.credentials.loggedInUser;
    const data = req.payload;
    User.findOne({email: userEmail}).then(foundUser => {
      foundUser.firstName = data.firstName;
      foundUser.lastName = data.lastName;
      foundUser.email = data.email;
      foundUser.password = data.password;
      return foundUser.save();
    }).then(editedUser => {
      res.view('account', {
        title: 'Account Settings',
        user: editedUser
      });
    }).catch(err => {
      console.log('Error updating users account: ' + err);
      res.redirect('/dashboard');
    });
  },
};