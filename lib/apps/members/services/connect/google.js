var Promise = require('bluebird');

module.exports = Promise.method(function(account, context) {
  return account;
});