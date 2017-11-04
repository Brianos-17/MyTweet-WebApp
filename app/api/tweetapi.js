'use strict';

const Tweet = require('../models/tweet');
const Boom = require('boom');

//Method to find one tweet
exports.findOne = {
  auth: false,
  handler: function(req, res) {
    Tweet.findOne({_id: req.params.id}).then(tweet => {
      res(tweet);
    }).catch(err => {
      res(Boom.notFound('Error finding tweet id: ' + err));
    });
  },
};

//Method to find all tweets
exports.findAll = {
  auth:false,
  handler: function(req, res) {
    Tweet.find({}).exec().then(tweets => {
      res(tweets);
    }).catch(err => {
      res(Boom.badImplementation('Error accessing database: ' + err));
    });
  },
};

//Method to create a new tweet
exports.addNewTweet = {
  auth: false,
  handler: function(req, res) {
    const tweet = new Tweet(req.payload);
    tweet.save().then(newTweet => {
      res(newTweet).code(201);
    }).catch(err => {
      res(Boom.badImplementation('Error creating new tweet: ' + err));
    });
  },
};

//Method to delete one tweet
exports.deleteOne = {
  auth: false,
  handler: function(req, res) {
    Tweet.remove({_id: req.params.id}).then(tweet => {
      res(tweet).code(204);
    }).catch(err => {
      res(Boom.notFound('Error finding tweet id: ' + err));
    });
  },
};

//Method to delete all tweets
exports.deleteAll = {
  auth: false,
  handler: function(req, res) {
    Tweet.remove({}).then(err => {
      res().code(204);
    }).catch(err => {
      res(Boom.badImplementation('Error deleting tweets: ' + err));
    });
  },
};