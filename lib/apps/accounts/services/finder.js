var _ = require('lodash')
  , Promise = require('bluebird')
  , Account = require('../repositories/account');

var Finder = function(context) {
  if (this instanceof Finder === false) return new Finder(context);

  this.context = context;
};

Finder.prototype.get = function(id) {
  return Account.get(id);
};

Finder.prototype.list = Promise.method(function(query) {
  if (query.member) return Account.listByMemberId(query.member, query);
  if (query.memberid) return Account.listByMemberId(query.memberid, query);
  if (query.network) return Account.listByNetwork(query.network, query);
  if (query.networkid) return Account.listByNetworkId(query.networkid, query);

  return [];
});

module.exports = Finder;