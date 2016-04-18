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

Repository.prototype.search = function(query, options) {
  return this.find(function(member) {
    return member('name').match('(?i)^' + query);
  }, options);
};

Repository.prototype.sanitize = function(member) {
  if (member == null) return;

  if (member.joinedAt) member.joinedAt = new Date(member.joinedAt).toISOString();
  
  return member;
};

Repository.prototype.clean = function(member) {
  if (member == null) return;

  return member;
};

Repository.prototype.index = function() {
  return this.createIndex('name');
};

module.exports = new Repository;
