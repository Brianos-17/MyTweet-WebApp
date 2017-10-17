'use strict';

/**
 * Class which uses node plugin 'Mongoose' in order to
 * create a schema and structure data for use with MongoDB
 */

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;