'use strict';

/**
 * Controller responsible for all methods users use to interact with the app
 **/

const User = require('../models/user');
const Tweet = require('../models/tweet');

exports.dashboard = {
  handler: function (req, res) {
    const userEmail = req.auth.credentials.loggedInUser;
    User.findOne({email: userEmail}).then(currentUser => {
      Tweet.find({user: currentUser._id}).sort({date: -1}).then(tweetList => {
        //sorts tweets in reverse chronological order
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

exports.adminDashboard = {
  handler: function (req, res) {
    const userType = 'admin';
    const userEmail = req.auth.credentials.loggedInUser;
    User.findOne({email: userEmail}).then(admin => {
      User.find({admin: false}).then(userList => {
      res.view('adminHome', {
        user: admin,
        userList: userList,
        userType: userType //Used for check in register method
      });
      });
    }).catch(err => {
      console.log('Error loading admin homepage: ' + err);
      res.redirect('/');
    });
  },
};

exports.globalTimeline = {
  handler: function(req, res) {
    Tweet.find({}).sort({date: -1}).then(tweetList => {
      res.view('globalTimeline', {
        title: 'MyTweet Global Timeline',
        tweet: tweetList,
        globalTimeline: true,
      });
    }).catch(err => {
      console.log("Error loading timeline: " + err);
      res.redirect('/dashboard');
    });
  },
};

exports.addTweet = {
  handler: function(req, res) {
    const userEmail = req.auth.credentials.loggedInUser;
    let userId = null;
    let tweet = null;
    User.findOne({ email: userEmail }).then(user => {
      let message = req.payload;
      const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      userId = user._id;
      tweet = new Tweet(message);
      tweet.date = date;
      tweet.user = userId;
      return tweet.save();
    }).then(newTweet => {
      console.log('New tweet added:' + tweet._id);
      res.redirect('/dashboard');
    }).catch(err => {
      console.log('Error saving tweet: ' + err);
      res.redirect('/');
    });
  },
};

exports.removeTweet = {

  handler: function (req, res) {
    const userEmail = req.auth.credentials.loggedInUser;
    const deletedTweet = req.params._id;
    User.findOne({email: userEmail}).then(currentUser => {
      Tweet.findOneAndRemove({ _id: deletedTweet }).then(tweet => {
        console.log('Tweet successfully deleted:' + tweet._id);
        if(currentUser.admin){
          res.redirect('/dashboard/viewUserTweets/' + tweet.user);
        } else {
          res.redirect('/dashboard');
        }
    });
    }).catch(err => {
      console.log('Error deleting tweet:' + err);
      res.redirect('/dashboard');
    });
  },
};

exports.removeUser = {
  handler: function (req, res) {
    const userId = req.params._id;
    User.findOneAndRemove({_id: userId}).then(removedUser => {
      console.log('Successfully deleted user: ' + removedUser.firstName
          + " " + removedUser.lastName);
      res.redirect('/adminDashboard');
    }).catch(err => {
      console.log('Error deleting user: ' + err);
      res.redirect('/adminDashboard');
    })
  },
};

exports.viewUserTweets = {
  handler: function(req, res) {
    const userId = req.params._id;
    User.findOne({_id: userId}).then(foundUser => {
      Tweet.find({user: userId}).then(tweets => {
        console.log('Loading tweets for user: ' + foundUser.firstName);
        res.view('globalTimeline', {
          title: foundUser.firstName + "'s Global Timeline",
          tweet: tweets,
          user: foundUser,
          admin: true
        });
      });
    }).catch(err => {
      console.log('Error loading users tweets: ' + err);
      res.redirect('/adminDashboard');
    });
  },
};

exports.deleteAll = {
  handler: function(req, res) {
    const userId = req.params.id;
    const userEmail = req.auth.credentials.loggedInUser;
    User.findOne({email: userEmail}).then(foundUser => {
      Tweet.remove({user: userId}).then(deletedTweets => {
        console.log('Deleted tweets for user: ' + userId);
        if(foundUser.admin){
          res.redirect('/adminDashboard');
        } else {
          res.redirect('/dashboard');
        }
      });
    }).catch(err => {
      console.log('Error deleting tweets: ' + err);
    });
  },
};