var _ = require('lodash')
  , Promise = require('bluebird')
  , Member = require('../repositories/member')
  , Creator = require('./creator');

var Finder = function(context) {
  if (this instanceof Finder === false) return new Finder(context);

  this.context = context;
};

Finder.prototype.get = function(id) {
  return Member.get(id);
};

var listOrCreateByUserId = function(userId, query, context) {
  return Member.listByUserId(userId, query).then(function(members) {
    if (members.length) return members;

    var creator = new Creator(context);

    return creator.createFromUserId(userId).then(function(member) {
      return [ member ];
    });
  });
};

Finder.prototype.list = Promise.method(function(query) {
  if (query.ids) return Member.listByIds(query.ids, query);
  if (query.user) return listOrCreateByUserId(query.user, query, this.context);
  if (query.userid) return listOrCreateByUserId(query.userid, query, this.context);
  if (query.statsid) return Member.listByStatsId(query.statsid, query, this.context);

  return [];
});

module.exports = Finder;