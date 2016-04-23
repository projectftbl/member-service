var _ = require('lodash')
  , Promise = require('bluebird')
  , Access = require('../repositories/access');

var Accessor = function(context) {
  if (this instanceof Accessor === false) return new Accessor(context);

  this.context = context;
};

Accessor.prototype.list = Promise.method(function(query) {
  if (query.userid) return Access.listByUserId(query.userid, query);
  if (query.memberid) return Access.listByMemberId(query.memberid, query);

  return [];
});

Accessor.prototype.setup = function(member) {
  var userId = member.createdBy || this.context.session.id;

  return this.add(member.id, userId);
};

Accessor.prototype.add = function(memberId, userId) {
  return Access.create({ memberId: memberId, userId: userId });
};

Accessor.prototype.setPrimary = function(memberId, userId) {
  return Access.updatePrimary(memberId, userId);
};

Accessor.prototype.remove = function(memberId, userId) {
  return Access.truncate({ memberId: memberId, userId: userId });
};

module.exports = Accessor;