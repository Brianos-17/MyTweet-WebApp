const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  message: String,
  date: String,
  user: String,
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;