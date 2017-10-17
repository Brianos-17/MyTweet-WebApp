const Accounts = require('./app/controllers/accounts');
const Dashboard = require('./app/controllers/dashboard');

module.exports = [
  { method: 'GET',    path: '/',        config: Accounts.main },
  { method: 'GET',    path: '/signup',  config: Accounts.signup },
  { method: 'GET',    path: '/login',   config: Accounts.login},
  { method: 'GET',    path: '/logout',  config: Accounts.logout},
  { method: 'GET',    path: '/home',    config: Dashboard.home},
  { method: 'GET',    path: '/account', config: Accounts.account},

  { method: 'POST',   path: '/register',      config: Accounts.register},
  { method: 'POST',   path: '/authenticate',  config: Accounts.authenticate},
];