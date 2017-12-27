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

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const myTweetWebService = new MyTweetWebService('http://localhost:4000');

  beforeEach(function () { //Ensures all test data is reset before each test in case previous test failed
    // myTweetWebService.deleteAllUsers();
  });

  afterEach(function () { //Ensures all test data is reset after each test
    // myTweetWebService.deleteAllUsers();
  });

  test('get all users', function () {
    for(let user of users){
      myTweetWebService.createUser(user);
    }
    const allUsers = myTweetWebService.getAllUsers();
    assert.equal(allUsers.length, users.length);
  });

  test('get one user', function () {
    const user = myTweetWebService.createUser(newUser);
    const test = myTweetWebService.getUser(user._id);
    assert.deepEqual(user, test);
  });

  test('get invalid user', function () {
    const user1 = myTweetWebService.getUser('1234');
    assert.isNull(user1);
    const user2 = myTweetWebService.getUser('012345678901234567890123');
    assert.isNull(user2);
  });


  test('create a user', function () {
    const returnedUser = myTweetWebService.createUser(newUser);
    assert(_.some([returnedUser], newUser),  'returnedUser must be a superset of newUser');
    assert.isDefined(returnedUser._id);
  });

  test('delete a user', function () {
    const user = myTweetWebService.createUser(newUser);
    assert(myTweetWebService.getUser(user._id) != null);
    myTweetWebService.deleteUser(user._id);
    assert(myTweetWebService.getUser(user._id) == null);
  });

  test('get user detail', function () {
    for (let user of users) {
      myTweetWebService.createUser(user);
    }

    const allUsers = myTweetWebService.getAllUsers();
    for (let i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), 'returnedUser must be a superset of newUser');
    }
  });

  test('get all users empty', function () {
    const allUsers = myTweetWebService.getAllUsers();
    assert.equal(allUsers.length, 0);
  });
});