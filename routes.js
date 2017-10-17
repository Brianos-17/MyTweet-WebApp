const Accounts = require('./app/controllers/accounts');

module.exports = [
  { method: 'GET', path: '/', config: Accounts.main },
  { method: 'GET', path: '/signup', config: Accounts.signUp },
];