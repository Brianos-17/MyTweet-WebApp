const Accounts = require('./app/controllers/accounts');
const Dashboard = require('./app/controllers/dashboard');

module.exports = [
  { method: 'GET',    path: '/',       config: Accounts.main },
  { method: 'GET',    path: '/signup', config: Accounts.signup },
  { method: 'GET',    path: '/login',  config: Accounts.login},
  { method: 'GET',    path: '/logout', config: Accounts.logut},
  { method: 'GET',    path: '/home',   config: Dashboard.home},

  { method: 'POST',   path: '/register',      config: Accounts.register},
  { method: 'POST',   path: '/authenticate',  config: Accounts.authenticate},
];