'use strict';

/**
 * Test class which exposes the API, tests the endpoints
 * @type {Object.assert}
 */

const assert = require('chai').assert;
const MyTweetWebService = require('./mytweetwebservice');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('User API tests', function () {

  let tweets = fixtures.users;
  let newTweet = fixtures.newTweet;

  const myTweetWebService = new MyTweetWebService('http://localhost:4000');

  beforeEach(function () { //Ensures all test data is reset before each test in case previous test failed
    myTweetWebService.deleteAllTweets();
  });

  afterEach(function () { //Ensures all test data is reset after each test
    myTweetWebService.deleteAllTweets();
  });

  test('get all tweets', function () {
    for(let tweet of tweets){
      myTweetWebService.createTweet(tweet);
    }
    const allTweets = myTweetWebService.getAllTweets();
    assert.equal(allTweets.length, tweets.length);
  });

  test('get one tweet', function () {
    const tweet = myTweetWebService.createTweet(newTweet);
    const test = myTweetWebService.getTweet(tweet._id);
    assert.deepEqual(tweet, test);
  });

  test('get invalid tweet', function () {
    const tweet1 = myTweetWebService.getUser('1234');
    assert.isNull(tweet1);
    const tweet2 = myTweetWebService.getUser('012345678901234567890123');
    assert.isNull(tweet2);
  });

  test('create a tweet', function () {
    const returnedTweet = myTweetWebService.createTweet(newTweet);
    assert(_.some([returnedTweet], newTweet),  'returnedTweet must be a superset of newTweet');
    assert.isDefined(returnedTweet._id);
  });

  test('delete a tweet', function () {
    const tweet = myTweetWebService.createTweet(newTweet);
    assert(myTweetWebService.getTweet(tweet._id) != null);
    myTweetWebService.deleteTweet(tweet._id);
    assert(myTweetWebService.getTweet(tweet._id) == null);
  });

  test('get user detail', function () {
    for (let tweet of tweets) {
      myTweetWebService.createTweet(tweet);
    }

    const allTweets = myTweetWebService.getAllTweets();
    for (let i = 0; i < tweets.length; i++) {
      assert(_.some([allTweets[i]], tweets[i]), 'returnedTweet must be a superset of newTweet');
    }
  });

  test('get all tweets empty', function () {
    const allTweets = myTweetWebService.getAllTweets();
    assert.equal(allTweets.length, 0);
  });
});