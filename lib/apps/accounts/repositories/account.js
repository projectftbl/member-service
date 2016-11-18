var _ = require('lodash')
  , inherits = require('util').inherits
  , Promise = require('bluebird')
  , utility = require('@recipher/utility')
  , Base = require('@recipher/store').Repository
  , schema = require('../schemas/account');

var NAME = 'account';

var Repository = function() {
  if (this instanceof Repository === false) return new Repository;

  Base.call(this, NAME, schema);
};

inherits(Repository, Base);

Repository.prototype.listByLink = function(link) {
  return this.find({ link: link });
};

Repository.prototype.listByMemberId = function(memberId, options) {
  return this.find({ memberId: memberId }, options);
};

Repository.prototype.listByNetwork = function(network, options) {
  return this.find({ network: network }, options);
};

Repository.prototype.listByNetworkId = function(networkId, options) {
  return this.find({ networkId: networkId }, options);
};

Repository.prototype.listRandomTokens = function(network, options) {
  var query = function(account) {
    return account.hasFields('token').and(account('network').eq(network));
  };

  return this.count(query).then(function(count) {
    var skip = utility.random(count)
      , limit = (options && options.limit) || 1;
    return this.find(query, { limit: limit, skip: skip });
  }.bind(this));
};

Repository.prototype.sanitize = function(account) {
  if (account == null) return;
  
  return account;
};

Repository.prototype.clean = function(account) {
  if (account == null) return;

  return account;
};

Repository.prototype.index = function() {
  return this.createIndexes('memberId', 'network', 'networkId');
};

module.exports = new Repository;
