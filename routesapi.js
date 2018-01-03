const UserApi = require('./app/api/usersapi');
const TweetApi = require('./app/api/tweetapi');

module.exports = [
  { method: 'GET', path: '/api/users', config: UserApi.findAll },
  { method: 'GET', path: '/api/users/{id}', config: UserApi.findOne },
  { method: 'POST', path: '/api/users', config: UserApi.addNewUser },
  { method: 'DELETE', path: '/api/users/{id}', config: UserApi.deleteOne },
  { method: 'DELETE', path: '/api/users', config: UserApi.deleteAll },
  { method: 'POST', path: '/api/users/authenticate', config: UserApi.authenticate },
  { method: 'GET',  path: '/api/users/{id}/tweets', config: UserApi.getUserTweets },

  { method: 'GET', path: '/api/tweet', config: TweetApi.findAll },
  { method: 'GET', path: '/api/tweet/{id}', config: TweetApi.findOne },
  { method: 'POST', path: '/api/tweet', config: TweetApi.addNewTweet },
  { method: 'DELETE', path: '/api/tweet/{id}', config: TweetApi.deleteOne },
  { method: 'DELETE', path: '/api/tweet', config: TweetApi.deleteAll },
];