const Accounts = require('./app/controllers/accounts');

module.exports = [
  { method: 'GET',    path: '/',       config: Accounts.main },
  { method: 'GET',    path: '/signup', config: Accounts.signup },
  { method: 'GET',    path: '/login',  config: Accounts.login},

  { method: 'POST',   path: '/register',      config: Accounts.register},
  { method: 'POST',   path: '/authenticate',  config: Accounts.authenticate},
];