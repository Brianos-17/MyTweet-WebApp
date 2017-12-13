const Accounts = require('./app/controllers/accounts');
const Dashboard = require('./app/controllers/dashboard');
const Assets = require('./app/controllers/assets');

module.exports = [
  { method: 'GET',    path: '/',                 config: Accounts.main },
  { method: 'GET',    path: '/signup',           config: Accounts.signup },
  { method: 'GET',    path: '/login',            config: Accounts.login },
  { method: 'GET',    path: '/logout',           config: Accounts.logout },
  { method: 'GET',    path: '/dashboard',        config: Dashboard.dashboard },
  { method: 'GET',    path: '/account',          config: Accounts.account },
  { method: 'GET',    path: '/globalTimeline',   config: Dashboard.globalTimeline },
  { method: 'GET',    path: '/removeTweet/{_id}',config: Dashboard.removeTweet },
  { method: 'GET',    path: '/adminDashboard',   config: Dashboard.adminDashboard },
  { method: 'GET',    path: '/deleteUser/{_id}', config: Dashboard.removeUser },
  { method: 'GET',    path: '/deleteAll/{id}',   config: Dashboard.deleteAll },
  { method: 'GET',    path: '/viewUser/{id}',    config: Dashboard.viewUser },
  { method: 'GET',    path: '/followUser/{id}',  config: Dashboard.followUser },
  { method: 'GET',    path: '/unfollowUser/{id}',config: Dashboard.unfollowUser },
  { method: 'GET',    path: '/userTweets',       config: Accounts.userTweets },
  { method: 'GET',    path: '/getProfilePic',    config: Accounts.getProfilePic },
  { method: 'GET',    path: '/getTweetImg/{id}', config: Accounts.getTweetImg },
  { method: 'GET',    path: '/getProfilePic/{id}',             config: Dashboard.getProfilePic },
  { method: 'GET',    path: '/dashboard/viewUserTweets/{_id}', config: Dashboard.viewUserTweets },

  { method: 'POST',   path: '/register/{userType}',       config: Accounts.register },
  { method: 'POST',   path: '/authenticate',              config: Accounts.authenticate },
  { method: 'POST',   path: '/addTweet/{userEmail}',      config: Dashboard.addTweet },
  { method: 'POST',   path: '/updateAccount/{userEmail}', config: Accounts.updateAccount },
  { method: 'POST',   path: '/updateProfilePic/{userEmail}',  config:Accounts.updateProfilePic },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

];