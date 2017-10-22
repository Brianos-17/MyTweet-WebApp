'use strict';

/**
 * Controller responsible for all methods users use to interact with the app
 **/

const User = require('../models/user');
const Tweet = require('../models/tweet');

exports.dashboard = {
  handler: function (req, res) {
    const userEmail = req.auth.credentials.loggedInUser;
    User.findOne( {email: userEmail} ).then(currentUser => {
      Tweet.find({ user: currentUser._id}).sort({date: -1}).then(tweetList => {
        res.view('home', {
          title: 'MyTweet Homepage',
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

exports.addTweet = {
  handler: function(req, res) {
    const userEmail = req.auth.credentials.loggedInUser;
    let userId = null;
    let tweet = null;
    User.findOne({ email: userEmail}).then(user => {
      let message = req.payload;
      const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      userId = user._id;
      tweet = new Tweet(message);
      tweet.user = userId;
      tweet.date = date;
      return tweet.save();
    }).then(newTweet => {
      res.redirect('/dashboard');
    }).catch(err => {
      console.log('Error saving tweet: ' + err);
      res.redirect('/');
    });
  },
};