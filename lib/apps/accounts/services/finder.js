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

Finder.prototype.list = function(query) {
  if (query.member) return Account.listByMember(query.member, query);
  if (query.memberid) return Account.listByMember(query.memberid, query);

  return Promise.cast([]);
};

module.exports = Finder;