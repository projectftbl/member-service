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

var listOrCreateByUserId = function(userId, query, context) {
  return new Accessor(context).list({ userid: userId }).then(function(access) {
    var ids = access == null ? [] : _(access).pluck('memberId').value()
      , primary = access == null ? null : _(access).find({ primary: true });

    return Member.listByIds(ids, query).then(function(members) {
      if (members.length) {
        return members.map(function(member) {
          member.primary = (primary && member.id === primary.memberId);
          return member;
        });
      }
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