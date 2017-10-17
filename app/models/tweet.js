const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  message: String,
  date: Date,
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;