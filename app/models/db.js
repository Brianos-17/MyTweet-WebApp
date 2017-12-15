'use strict';

/**
 * Class which stores the actual database and initialises it upon start-up
 *
 */

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let dbURI = 'mongodb://localhost/mytweet';
//let dbURI = 'mongodb://mytweetuser:mytweetuser@ds245715.mlab.com:45715/mytweet';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
  // if(process.env.NODE_ENV != 'production') {
  //   var seeder = require('mongoose-seeder');
  //   const data = require('./data.json');
  //   const User = require('./user');
  //   const Tweet = require('./tweet');
  //   seeder.seed(data, { dropDatabase:false, dropCollections: true}).then(dbData => {
  //     console.log('preloading Test Data');
  //   }).catch(err => {
  //     console.log(error);
  //   });
  // }
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});