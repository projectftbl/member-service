var _ = require('lodash')
  , Promise = require('bluebird')
  , Account = require('../repositories/account');

var Tokens = function(context) {
  if (this instanceof Tokens === false) return new Tokens(context);

  this.context = context;
};

Tokens.prototype.random = function(query) {
  return Account.listRandomTokens(query.network, query);
};

module.exports = Tokens;