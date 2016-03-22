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
  if (query.member) return Account.listByMember(query.member, query);
  if (query.memberid) return Account.listByMember(query.memberid, query);
  if (query.networkid) return Account.listByNetwork(query.networkid, query);

  return [];
});

module.exports = Finder;