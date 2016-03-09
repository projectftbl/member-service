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

Repository.prototype.listByMember = function(member) {
  return this.find({ memberId: member });
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
