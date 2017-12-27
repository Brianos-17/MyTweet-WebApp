'use strict';

/**
 * Test class which exposes the API, tests the endpoints
 * @type {Object.assert}
 */

const assert = require('chai').assert;
const MyTweetWebService = require('./mytweetwebservice');
const fixtures = require('./fixtures.json');
const utils = require('../api/utils.js');

suite('Auth API tests', function () {

  let users = fixtures.users;

  const myTweetWebService = new MyTweetWebService('http://localhost:4000');

  beforeEach(function () {
    // myTweetWebService.deleteAllUsers();
  });

  afterEach(function () {
    // myTweetWebService.deleteAllUsers();
  });

  test('login-logout', function () {
    let returnedUsers = myTweetWebService.getAllUsers();
    assert.isNull(returnedUsers);

    myTweetWebService.login(users[0]);
    returnedUsers = myTweetWebService.getAllUsers();
    assert.isNotNull(returnedUsers);

    myTweetWebService.logout();
    returnedUsers = myTweetWebService.getAllUsers();
    assert.isNull(returnedUsers);
  });
});