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
  var userId = member.createdBy || context.session.id;

  return Access.create({ memberId: member.id, userId: userId });
};

module.exports = Accessor;