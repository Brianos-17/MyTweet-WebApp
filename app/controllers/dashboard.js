'use strict';

/**
 * Controller responsible for all methods users use to interact with the app
 **/

exports.dashboard = {
  handler: function (req, res) {
    res.view('home', {
      title: 'MyTweet Homepage'
    });
  }
};