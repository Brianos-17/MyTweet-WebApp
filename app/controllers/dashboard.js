'use strict';

/**
 * Controller responsible for all methods users use to interact with the app
 **/

const User = require('../models/user');
const Tweet = require('../models/tweet');

exports.dashboard = {
  handler: function (req, res) {
    res.view('home', {
      title: 'MyTweet Homepage'
    });
  }
};

exports.addTweet = {
  handler: function(req, res) {
    const userEmail = req.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail}).then(user => {
      const message = req.payload;
      const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      const user = user._id;
      const tweet = new Tweet(message, date, user);
    })
  }
}