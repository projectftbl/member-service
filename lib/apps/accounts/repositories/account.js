var _ = require('lodash')
  , inherits = require('util').inherits
  , Promise = require('bluebird')
  , Base = require('@ftbl/store').Repository
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

Repository.prototype.sanitize = function(account) {
  if (account == null) return;
  
  return account;
};

Repository.prototype.clean = function(account) {
  if (account == null) return;

  return account;
};

module.exports = new Repository;
