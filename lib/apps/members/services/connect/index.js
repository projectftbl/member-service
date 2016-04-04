var Promise = require('bluebird');

var Connect = function(context) {
  if (this instanceof Connect === false) return new Connect(context);

  this.context = context;
};

Connect.prototype.connect = Promise.method(function(account) {
  if (account.token == null) return;

  var connect = require('./' + account.network);

  return connect(account, this.context);
});

module.exports = Connect;