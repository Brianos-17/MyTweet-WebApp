'use strict';

/**
 * Class which holds functions intended to test the endpoints relating to the
 * User model of the API
 */

const User = require('../models/user');
const Tweet = require('../models/tweet');
const Boom = require('boom');
const utils = require('./utils.js');

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
    user.save().then(newUser => {
      res(newUser).code(201);//201 HTTP code for resource created
    }).catch(err => {
      res(Boom.badImplementation('Error creating new user: ' + err));
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
      if (foundUser && foundUser.password === password) {
        reply(foundUser).code(201);
      } else {
        reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
      }
    }).catch(err => {
      reply(Boom.notFound('internal db failure'));
    });
  },
};

exports.getUserTweets = {
  auth: false,
  handler: function (req, res) {
    const user = req.payload;
    User.findOne({ email: user.email }).then(foundUser => {
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
