var _ = require('lodash')
  , inherits = require('util').inherits
  , Base = require('@ftbl/store').Repository
  , schema = require('../schemas/member');

var NAME = 'member';

var Repository = function() {
  if (this instanceof Repository === false) return new Repository;

  Base.call(this, NAME, schema);
};

inherits(Repository, Base);

Repository.prototype.listByIds = function(ids) {
  return this.find(function(member) {
    return this.database.expr(ids).contains(member('id'));
  }.bind(this));
};

Repository.prototype.listByUserId = function(id) {
  return this.find({ userId: id });
};

Repository.prototype.listByStatsId = function(id) {
  return this.find({ statsId: id });
};

Repository.prototype.sanitize = function(member) {
  if (member == null) return;
  
  return member;
};

Repository.prototype.clean = function(member) {
  if (member == null) return;

  return member;
};

module.exports = new Repository;
