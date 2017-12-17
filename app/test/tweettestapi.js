'use strict';

/**
 * Test class which exposes the API, tests the endpoints
 * @type {Object.assert}
 */

const assert = require('chai').assert;
var request = require('sync-request');

suite('User API tests', function () {

  test('get all tweets', function () {
    const tweetURL = 'http://localhost:4000/api/tweet';
    const res = request('GET', tweetURL);
    const tweets = JSON.parse(res.getBody('utf8'));

    assert.equal(tweets.length, 7);
    assert.equal(tweets[0].message, '1st Tweet');
    assert.equal(tweets[0].date, '2017-11-03 13:32:52');
    assert.equal(tweets[1].message, '2nd Tweet');
    assert.equal(tweets[1].date, '2017-11-03 20:13:06');
    assert.equal(tweets[2].message, 'Test #1');
    assert.equal(tweets[2].date, '2017-11-03 20:13:11');
    assert.equal(tweets[3].message, 'Test #2');
    assert.equal(tweets[3].date, '2017-11-03 20:13:15');
    assert.equal(tweets[4].message, 'Hello from Homer');
    assert.equal(tweets[4].date, '2017-11-03 20:20:20');
    assert.equal(tweets[5].message, 'Hello from Marge');
    assert.equal(tweets[5].date, '2017-11-03 20:20:20');
    assert.equal(tweets[6].message, 'Hello from Maggie');
    assert.equal(tweets[6].date, '2017-11-03 22:22:22');
  });

  test('get one tweet', function() {

    const tweetURL = 'http://localhost:4000/api/tweet';
    let res = request('GET', tweetURL);
    const tweets = JSON.parse(res.getBody('utf8'));

    const oneTweetURL = tweetURL + '/' + tweets[0]._id;
    res = request('GET', oneTweetURL);
    const oneTweet = JSON.parse(res.getBody('utf8'));

    assert.equal(oneTweet.message, '1st Tweet');
    assert.equal(oneTweet.date, '2017-11-03 13:32:52');
  });

  test('create a tweet', function() {

    const tweetURL = 'http://localhost:4000/api/tweet';
    const newTweet = {
      message: 'This is a new tweet',
      date: '2017-11-04 20:00:00'
    };

    const res = request('POST', tweetURL, {json: newTweet});
    const returnedTweet = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedTweet.message, 'This is a new tweet');
    assert.equal(returnedTweet.date, '2017-11-04 20:00:00');
    assert.equal(returnedTweet.user, '59fb5d7a7a33fc2e10b243e2');
  });

  test('delete one tweet', function() {
    const tweetURL = 'http://localhost:4000/api/tweet';
    let res = request('GET', tweetURL);
    let tweets = JSON.parse(res.getBody('utf8'));
    const size = tweets.length;

    const deletedTweet = tweetURL+ '/' + tweets[7]._id;
    res = request('DELETE', deletedTweet);

    assert(res.statusCode, 204);//ensures successful deletion

    res = request('GET', tweetURL);
    tweets = JSON.parse(res.getBody('utf8'));
    assert.equal(tweets.length, size -1);
  });

  test('delete all tweets', function() {
    const tweetURL = 'http://localhost:4000/api/tweet';
    let res = request('DELETE', tweetURL);

    assert(res.statusCode, 204);

    res = request('GET', tweetURL);
    let tweets = JSON.parse(res.getBody('utf8'));
    assert.equal(tweets.length, 0);
  });

});