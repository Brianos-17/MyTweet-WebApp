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
  { method: 'GET',    path: '/dashboard/viewUserTweets/{_id}', config: Dashboard.viewUserTweets },

  { method: 'POST',   path: '/register/{userType}',       config: Accounts.register },
  { method: 'POST',   path: '/authenticate',              config: Accounts.authenticate },
  { method: 'POST',   path: '/addTweet/{userEmail}',      config: Dashboard.addTweet },
  { method: 'POST',   path: '/updateAccount/{userEmail}', config: Accounts.updateAccount },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

];