/**
 * Tweet model, schema for Tweets used by mongoose to save in MongoDB
 */

const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  message: String,
  date: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;