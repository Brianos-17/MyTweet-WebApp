'use strict';

/**
 * Controller class, holds functions primarily relating to navigation around web apps pages,
 * registration of new users, and authentication for logging in and out. Provides Joi validation
 * for methods which require user input
 */

const User = require('../models/user');
const Tweet = require('../models/tweet');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const saltrounds = 10; //Salts passwords 10 times
const utils = require('../api/utils');

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

  validate: {
     payload: {
       firstName: Joi.string().regex(/^[a-z]+$/i).required(), // Only allows letters, case insensitive
       lastName: Joi.string().regex(/^[a-z]+$/i).required(), // Only allows letters, case insensitive
       password: Joi.string().alphanum().min(5).required(), // Password can only contain alpha-numeric characters and must be at least 5 characters long
       passwordValid: Joi.string().required().valid(Joi.ref('password')), // Must match password
       email: Joi.string().email().required(), // Must be a valid email format
     },
    options: {
       abortEarly: false,
    },
    failAction: function(req, res, source, err) {
       res.view('signup', {
         title: 'Sign Up for MyTweet',
         userType: 'user',
         errors: err.data.details,
       }).code(400);
    },
  },

  handler: function(req, res) {
    const userType = req.params.userType;
    const user = new User(req.payload);
    const plaintextPassword = user.password;
    bcrypt.hash(plaintextPassword, saltrounds, function(err, hash) {
      user.password = hash;
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

  validate: {
    payload: {
      password: Joi.string().alphanum().min(5).required(),
      email: Joi.string().email().required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function(req, res, source, err) {
      res.view('login', {
        title: "Log In to MyTweet",
        errors: err.data.details,
      }).code(400);
    },
  },

  handler: function (req, res) {
    const user = req.payload;
    User.findOne({email: user.email}).then(foundUser => {
      bcrypt.compare(user.password, foundUser.password, function(err, isValid) {
        if(isValid) {
          // const token = utils.createToken(foundUser);
          // console.log(token);
          req.cookieAuth.set({
            loggedIn: true,
            loggedInUser: user.email,//assigns the users email as their cookie authentication
          });
          if (foundUser.admin){
            res.redirect('/adminDashboard');
          } else {
            res.redirect('/dashboard');
          }
        }
      });
    }).catch(err => {
      console.log('Error logging in: ' + err);
      res.redirect('/login');
    });
  },
};

exports.logout = {
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

  validate: {
    payload: {
      firstName: Joi.string().regex(/^[a-z]+$/i).required(),
      lastName: Joi.string().regex(/^[a-z]+$/i).required(),
      password: Joi.string().alphanum().min(5).required(),
      passwordValid: Joi.string().required().valid(Joi.ref('password')),
      email: Joi.string().email().required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function(req, res, source, err) {
      const userEmail = req.params.userEmail;
      User.findOne({email: userEmail}).then(currentUser => {
        res.view('account', {
          title: 'Account Settings',
          user: currentUser,
          errors: err.data.details,
        }).code(400);
      }).catch(err => {
        console.log('Error loading user data for account update: ' + err);
        res.redirect('/dashboard');
      })
    },
  },
  handler: function (req, res) {
    const userEmail = req.params.userEmail;
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

exports.userTweets = {
  handler: function (req, res) {
    const userEmail = req.auth.credentials.loggedInUser;
    User.findOne({email: userEmail}).then(currentUser => {
      Tweet.find({user: currentUser._id}).sort({date: -1}).then(tweetList => {
        //sorts tweets in reverse chronological order
        res.view('userTweets', {
          title: currentUser.firstName +"'s Tweets",
          user: currentUser,
          tweet: tweetList,
        });
      });
    }).catch(err => {
      console.log('Error loading dashboard: ' + err);
      res.redirect('/');
    });
  },
};

exports.updateProfilePic = {

  payload: {
    maxBytes: 209715200, // Validates the payload image via size
    output: 'stream',
    parse: true,
    allow: 'multipart/form-data'
  },
  handler: function (req, res) {
    const userEmail = req.auth.credentials.loggedInUser;
    const pic = req.payload.profilePic;
    User.findOne({email: userEmail}).then(foundUser => {
      foundUser.profilePic.data = pic._data;
      foundUser.profilePic.contentType = 'image/png';
      foundUser.save();
      res.redirect('/account');
    }).catch(err => {
      console.log(err);
      res.redirect('/account');
    })
  }
};

exports.getProfilePic = {
  handler: function (req ,res) {
    const userEmail = req.auth.credentials.loggedInUser;
    User.findOne({email: userEmail}).then(foundUser => {
      res(foundUser.profilePic.data).type('image');
    });
  }
};

exports.getTweetImg = {
  handler: function (req, res) {
    const tweetId = req.params._id;
    Tweet.findOne({_id: tweetId}).then(foundTweet => {
      res(foundTweet.img.data).type('image');
    });
  }
};
