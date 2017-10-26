const Accounts = require('./app/controllers/accounts');
const Dashboard = require('./app/controllers/dashboard');

module.exports = [
  { method: 'GET',    path: '/',                config: Accounts.main },
  { method: 'GET',    path: '/signup',          config: Accounts.signup },
  { method: 'GET',    path: '/login',           config: Accounts.login },
  { method: 'GET',    path: '/logout',          config: Accounts.logout },
  { method: 'GET',    path: '/dashboard',       config: Dashboard.dashboard },
  { method: 'GET',    path: '/account',         config: Accounts.account },
  { method: 'GET',    path: '/globalTimeline',  config: Dashboard.globalTimeline },

  { method: 'POST',   path: '/register',      config: Accounts.register },
  { method: 'POST',   path: '/authenticate',  config: Accounts.authenticate },
  { method: 'POST',   path: '/addTweet',      config: Dashboard.addTweet },

  { method: 'GET', path: '/removeTweet/{id}', config: Dashboard.removeTweet }

];