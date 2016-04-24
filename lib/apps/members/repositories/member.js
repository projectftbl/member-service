var _ = require('lodash')
  , moment = require('moment')
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

var search = function(query, options) {
  var time = this.database.time.bind(this.database)
    , ISO8601 = this.database.ISO8601.bind(this.database);

  var to = moment(options.to)
    , from = moment(options.from || [ 2016, 1, 1]);

  var t = time(to.year(), to.month() + 1, to.date(), 23, 59, 0, 'Z')
    , f = time(from.year(), from.month() + 1, from.date(), 0, 0, 0, 'Z');

  return function(member) {
    return member('name').match('(?i)^' + query).and(
           ISO8601(member('joinedAt')).during(f, t));
  };
};

Repository.prototype.search = function(query, options) {
  var filter = search.call(this, query, options);
  return this.find(filter, options);
};

Repository.prototype.total = function(query, options) {
  var filter = search.call(this, query, options);
  return this.count(filter, options);
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
  return this.createIndex('name').then(function() {
    return this.createIndex('joinedAt');
  }.bind(this));
};

module.exports = new Repository;
