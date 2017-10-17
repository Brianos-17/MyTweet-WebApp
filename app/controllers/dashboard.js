'use strict';

/**
 * Controller responsible for all methods users use to interact with the app
 **/

exports.home = {
  handler: function (req, res) {
    res.view('home', {
      title: 'MyTweet Homepage'
    });
  }
};