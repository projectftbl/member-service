var _ = require('lodash')
  , Promise = require('bluebird')
  , Member = require('../repositories/member')
  , Accessor = require('./accessor')
  , Creator = require('./creator');

var Finder = function(context) {
  if (this instanceof Finder === false) return new Finder(context);

  this.context = context;
};

Finder.prototype.get = function(id) {
  return Member.get(id);
};

Finder.prototype.list = Promise.method(function(query) {
  if (query.ids) return Member.listByIds(query.ids, query);
  if (query.user) return new Accessor(this.context).members(query.user);
  if (query.userid) return new Accessor(this.context).members(query.userid);
  if (query.statsid) return Member.listByStatsId(query.statsid, query);

  return [];
});

Finder.prototype.search = function(query, options) {
  if (query == null) return Member.find({}, options); // Temp
  return Member.search(query, options);
};

Finder.prototype.total = function(query, options) {
  return Member.total(query, options);
};

module.exports = Finder;