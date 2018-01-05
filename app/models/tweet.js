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
  img: {
    data: Buffer,
    contentType: String,
  },
  address: String,
  marker: {
    coords: {
      latitude: Number,
      longitude: Number,
    }
  }
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;