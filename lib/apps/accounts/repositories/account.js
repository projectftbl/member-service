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

Repository.prototype.listByMemberId = function(memberId) {
  return this.find({ memberId: memberId });
};

Repository.prototype.listByNetwork = function(network) {
  return this.find({ network: network });
};

Repository.prototype.listByNetworkId = function(networkId) {
  return this.find({ networkId: networkId });
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
