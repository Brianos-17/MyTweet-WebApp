'use strict';

/**
 * Controller responsible for all methods with which users interact with the app
 * Responsible for creating and deleting tweets as well as rendering correct views of tweets
 **/

const User = require('../models/user');
const Tweet = require('../models/tweet');
const Joi = require('joi');

exports.dashboard = {
  handler: function (req, res) {
    const userEmail = req.auth.credentials.loggedInUser;
    let follow = false;
    User.findOne({email: userEmail}).then(currentUser => {
      User.find({_id: currentUser.following}).then(followedUsers => {
        Tweet.find({user: followedUsers}).populate('user').sort({date: -1}).then(tweetList => {
          //sorts tweets in reverse chronological order
          if(tweetList.length === 0){
            follow = true;
          }
          res.view('home', {
            title: 'MyTweet Homepage',
            user: currentUser,
            tweet: tweetList,
            follow: follow,
          });
        });
      }).catch(err => {
        console.log('Error loading dashboard: ' + err);
        res.redirect('/');
      });
    });
  },
};

exports.adminDashboard = {
  handler: function (req, res) {
    const userType = 'admin';//needed to redirect admins back to admin homepage
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
    Tweet.find({}).sort({date: -1}).populate('user').then(tweetList => {
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
  validate: {

    payload: {
      message: Joi.string().max(140).required(),
      img: Joi.allow(null), // Allows users to include no image
      maxBytes: 209715200, // Validates the payload image via size
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },
    failAction: function(req, res, source, err) {
      console.log(err);
      const userEmail = req.auth.credentials.loggedInUser;
      User.findOne({email: userEmail}).then(currentUser => {
        Tweet.find({user: currentUser._id}).then(tweetList => {
          res.view('userTweets', {
          title: currentUser.firstName + "'s Tweets",
          user: currentUser,
          tweet: tweetList,
          errors: err.data.details,
        }).code(400);
        });
      }).catch(err => {
        console.log('Error getting user data for new tweet: ' + err);
        res.redirect('/dashboard');
      });
    },
  },
  handler: function(req, res) {
    const userEmail = req.params.userEmail;
    const img = req.payload.img;
    let userId = null;
    let tweet = null;
    User.findOne({ email: userEmail }).then(user => {
      const message = req.payload.message;
      const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      userId = user._id;
      tweet = new Tweet({message: message});
      tweet.date = date;
      tweet.user = userId;
      if(img.length) { //Checks payload to see if image is present or not
        tweet.img.data = img;
        tweet.img.contentType = 'image/png';
      }
      tweet.save();
      console.log('New tweet added: ' + tweet._id);
      res.redirect('/userTweets');
    }).catch(err => {
      console.log('Error saving tweet: ' + err);
      res.redirect('/userTweets');
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
          res.redirect('/userTweets');
        }
    });
    }).catch(err => {
      console.log('Error deleting tweet:' + err);
      res.redirect('/userTweets');
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

exports.viewUser = {
  handler: function (req, res) {
    const userId = req.params.id;
    let following = false;
    User.findOne({_id: userId}).then(foundUser => {
      User.find({_id: foundUser.following}).then(followedUser => {
        Tweet.find({user: foundUser._id}).populate('user').sort({date: -1}).then(tweets => {
          if (followedUser.length > 0){
            following = true;
          }
          res.view('viewUser', {
            title: foundUser.firstName + "'s Tweets",
            user: foundUser,
            tweet: tweets,
            following: following,
            followedUser: followedUser
          });
        });
      })
    }).catch(err => {
      console.log('Error loading user details: ' + err);
      res.redirect('/globalTimeline');
    })
  },
};

exports.followUser = {
  handler: function (req, res) {
    const userEmail = req.auth.credentials.loggedInUser;
    const userId = req.params.id;
    User.findOne({email: userEmail}).then(currentUser => {
      User.findOne({_id: userId}).then(foundUser => {
        currentUser.following.push(foundUser._id);
        currentUser.save();
        console.log(currentUser.firstName + " is now following " + foundUser.firstName);
        res.redirect('/dashboard');
      });
    }).catch(err => {
      console.log('Error following user: '  + err);
      reply.redirect('/globalTimeline')
    })
  }
};

exports.unfollowUser = {
  handler: function (req, res) {
    const userEmail = req.auth.credentials.loggedInUser;
    const userId = req.params.id;
    User.findOne({email: userEmail}).then(currentUser => {
      User.findOne({_id: userId}).then(foundUser => {
        const index = currentUser.following.indexOf(foundUser._id);
        currentUser.following.splice(index, 1);
        currentUser.save();
        console.log(currentUser.firstName + " is no longer following " + foundUser.firstName);
        res.redirect('/dashboard');
      });
    }).catch(err => {
      console.log('Error following user: '  + err);
      reply.redirect('/globalTimeline')
    })
  }
};

exports.getProfilePic = {
  handler: function (req, res) {
    const userId = req.params.id;
    User.findOne({_id: userId}).then(foundUser => {
      res(foundUser.profilePic.data).type('image');
    })
  }
};

