var inherits = require('util').inherits
  , Base = require('@ftbl/store').Repository
  , schema = require('../schemas/access');

var NAME = 'access';

var Repository = function() {
  if (this instanceof Repository === false) return new Repository;

  Base.call(this, NAME, schema);
};

inherits(Repository, Base);

Repository.prototype.listByUserId = function(id, options) {
  return this.find({ userId: id });
};

Repository.prototype.listByMemberId = function(id, options) {
  return this.find({ memberId: id });
};

Repository.prototype.listPrimaryByMemberId = function(id, options) {
  return this.find({ primary: true, memberId: id });
};

Repository.prototype.updatePrimary = function(memberId, userId) {
  return this.table.filter({ memberId: memberId }).update({ primary: false }).then(function() {
    return this.table.filter({ memberId: memberId, userId: userId }).update({ primary: true });
  }.bind(this));
};

Repository.prototype.sanitize = function(access) {
  if (access == null) return;
  
  return access;
};

Repository.prototype.clean = function(access) {
  if (access == null) return;

  return access;
};

module.exports = new Repository;
