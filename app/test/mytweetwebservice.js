/**
 * Class responsible for encapsulating client side api routes
 * Works with sync-https-services to provide simplified testing
 */
'use strict';

const SyncHttpService = require('./sync-http-services');
const baseUrl = 'http://localhost:4000';

class MyTweetWebService {

  constructor(baseUrl) {
    this.httpService = new SyncHttpService(baseUrl);
  }

  getAllUsers() {
    return this.httpService.get('/api/users');
  }

  getUser(id) {
    return this.httpService.get('/api/users/' + id);
  }

  createUser(newUser) {
    return this.httpService.post('/api/users', newUser);
  }

  deleteUser(id) {
    return this.httpService.delete('/api/users/' + id);
  }

  deleteAllUsers() {
    return this.httpService.delete('/api/users');
  }

  getAllTweets() {
    return this.httpService.get('/api/tweet');
  }

  getTweet(id) {
    return this.httpService.get('/api/tweet/' + id);
  }

  createTweet(newTweet) {
    return this.httpService.post('/api/tweet', newTweet);
  }

  deleteTweet(id) {
    return this.httpService.delete('/api/tweet/' + id);
  }

  deleteAllTweets() {
    return this.httpService.delete('/api/tweet');
  }
}

module.exports = MyTweetWebService;