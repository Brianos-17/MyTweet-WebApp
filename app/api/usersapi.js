'use strict';

/**
 * Class which holds functions intended to test the endpoints relating to the
 * User model of the API
 */

const User = require('../models/user');
const Tweet = require('../models/tweet');
const Boom = require('boom');
const utils = require('./utils.js');
const bcrypt = require('bcrypt');
const saltrounds = 10; //Salts passwords 10 times

//Method for finding one user
exports.findOne = {
  auth: false,
  handler: function(req, res) {
    User.findOne({_id: req.params.id }).then(user => {
      if(user != null){
        res(user);
      }
      res(Boom.notFound('User id not found'));
    }).catch(err => {
      res(Boom.notFound('User id not found: ' + err))
    });
  },
};

//Method to find all users
exports.findAll = {
  auth: false,
  handler: function (req, res) {
    User.find({}).exec().then(users => {
      res(users);
    }).catch(err => {
      res(Boom.badImplementation('Error accessing database: ' + err));
    });
  },
};

//Method for creating a new user
exports.addNewUser = {
  auth: false,
  handler: function (req, res) {
    const user = new User(req.payload);
    bcrypt.hash(user.password, saltrounds, function(err, hash) {
      user.password = hash;
      user.save().then(newUser => {
        res(newUser).code(201);//201 HTTP code for resource created
      }).catch(err => {
        res(Boom.badImplementation('Error creating new user: ' + err));
      });
    });
  },
};

//Method to delete one User
exports.deleteOne = {
  auth: false,
  handler: function (req, res) {
    User.remove({_id: req.params.id}).then(user => {
      res(user).code(204);// 204: No content, ensures deletion
    }).catch(err => {
      res(Boom.notFound('User Id not found: ' + err));
    });
  },
};

//Method to delete all user
exports.deleteAll = {
  auth: false,
  handler: function(req, res) {
    User.remove({}).then(err => {
      res().code(204);
    }).catch(err => {
      res(Boom.badImplementation('Error removing users: ' + err));
    });
  },
};

exports.authenticate = {
  auth: false,
  handler: function (request, reply) {
    const email = request.payload.email;
    const password = request.payload.password;
    User.findOne({ email: email }).then(foundUser => {
      bcrypt.compare(password, foundUser.password, function (err, isValid) {
        if (isValid) {
          reply(foundUser).code(201);
        } else {
          reply(Boom.badImplementation('Error removing users: ' + err));
        }
      });
    }).catch(err => {
      reply(Boom.notFound('internal db failure ' + err));
    });
  },
};

exports.getUserTweets = {
  auth: false,
  handler: function (req, res) {
    const id = req.params.id;
    User.findOne({ _id: id }).then(foundUser => {
      Tweet.find({ userId: foundUser._id }).then(foundTweets => {
        if(foundTweets != null){
          res(foundTweets);
        } res(Boom.notFound("No tweets found"));
      })
    }).catch(err => {
      res(Boom.notFound('User id not found: ' + err));
      });
  },
};
