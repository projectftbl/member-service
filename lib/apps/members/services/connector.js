var Promise = require('bluebird');

var Connector = function(context) {
  if (this instanceof Connector === false) return new Connector(context);

  this.context = context;
};

Connector.prototype.connect = Promise.method(function(account) {
  if (account.token == null) return;

  var connect = require('./connect/' + account.network);

  return connect(account);
});

module.exports = Connector;