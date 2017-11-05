'use strict';

/**
 * Test class which exposes the API, tests the endpoints
 * @type {Object.assert}
 */

const assert = require('chai').assert;
var request = require('sync-request');

suite('User API tests', function () {

  test('get all users', function () {

    const usersURL = 'http://localhost:4000/api/users';
    const res = request('GET', usersURL);
    const users = JSON.parse(res.getBody('utf8'));

    assert.equal(4, users.length);

    assert.equal(users[0].firstName, 'Bart');
    assert.equal(users[0].lastName, 'Simpson');
    assert.equal(users[0].email, 'bart@simpson.com');
    assert.equal(users[0].password, 'secret');

    assert.equal(users[1].firstName, 'Marge');
    assert.equal(users[1].lastName, 'Simpson');
    assert.equal(users[1].email, 'marge@simpson.com');
    assert.equal(users[1].password, 'secret');

    assert.equal(users[2].firstName, 'Homer');
    assert.equal(users[2].lastName, 'Simpson');
    assert.equal(users[2].email, 'homer@simpson.com');
    assert.equal(users[2].password, 'secret');

    assert.equal(users[3].firstName, 'Maggie');
    assert.equal(users[3].lastName, 'Simpson');
    assert.equal(users[3].email, 'maggie@simpson.com');
    assert.equal(users[3].password, 'secret');
  });

  test('get one user', function () {

    const usersURL = 'http://localhost:4000/api/users';
    let res = request('GET', usersURL);
    const users = JSON.parse(res.getBody('utf8'));

    const oneUserUrl = usersURL + '/' + users[0]._id;
    res = request('GET', oneUserUrl);
    const oneUser = JSON.parse(res.getBody('utf8'));

    assert.equal(oneUser.firstName, 'Bart');
    assert.equal(oneUser.lastName, 'Simpson');
    assert.equal(oneUser.email, 'bart@simpson.com');
    assert.equal(oneUser.password, 'secret');
    assert.equal(oneUser.admin, true);
  });

  test('create a user', function() {

    const usersURL = 'http://localhost:4000/api/users';
    const newUser = {
      firstName: 'Lisa',
      lastName: 'Simpson',
      email: 'lisa@simpson.com',
      password: 'secret',
      admin: false
    };

    const res = request('POST', usersURL, { json: newUser });
    const returnedUser = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedUser.firstName, 'Lisa');
    assert.equal(returnedUser.lastName, 'Simpson');
    assert.equal(returnedUser.email, 'lisa@simpson.com');
    assert.equal(returnedUser.password, 'secret');
    assert.equal(returnedUser.admin, false);
  });

  test('delete one user', function() {
    const usersURL = 'http://localhost:4000/api/users';
    let res = request('GET', usersURL);
    let users = JSON.parse(res.getBody('utf8'));
    let size = users.length;

    const deletedUser = usersURL+ '/' + users[4]._id;
    res = request('DELETE', deletedUser);

    assert(res.statusCode, 204);//ensures successful deletion

    res = request('GET', usersURL);
    users = JSON.parse(res.getBody('utf8'));
    assert.equal(users.length, size -1);
  });

  // test('delete all users', function() {
  //   const usersURL = 'http://localhost:4000/api/users';
  //   let res = request('DELETE', usersURL);
  //
  //   assert(res.statusCode, 204);
  //
  //   res = request('GET', usersURL);
  //   let users = JSON.parse(res.getBody('utf8'));
  //   assert.equal(users.length, 0);
  // });
});