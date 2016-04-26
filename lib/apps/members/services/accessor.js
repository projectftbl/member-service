var _ = require('lodash')
  , Promise = require('bluebird')
  , errors = require('@ftbl/errors')
  , publish = require('@ftbl/task').publish
  , request = require('@ftbl/request')
  , Authorizer = require('@ftbl/authorize')
  , Access = require('../repositories/access')
  , Member = require('../repositories/member');

var Accessor = function(context) {
  if (this instanceof Accessor === false) return new Accessor(context);

  this.context = context;
};

Accessor.prototype.list = Promise.method(function(query) {
  if (query.userid) return Access.listByUserId(query.userid, query);
  if (query.memberid) return Access.listByMemberId(query.memberid, query);

  return [];
});

Accessor.prototype.total = function(query) {
  return Access.count(query);
};

Accessor.prototype.users = function(memberId, query) {
  var context = this.context
    , FullAccess = Authorizer.permissions.FullAccess;

  return Member.get(memberId).then(function(member) {
    if (member == null) return [];

    return this.list(_.assign({}, query, { memberid: memberId })).then(function(access) {
      var ids = access == null ? [] : _(access).pluck('userId').value();

      return request('users/users', context).get({ ids: ids }).then(function(data) {
        return data.users.map(function(user) {
          var claim = _(user.claims).find(function(claim) {
            return claim.entity === memberId;
          });

          if ((claim == null || claim.right !== FullAccess) && user.id === member.createdBy) {
            claim = { entity: memberId, right: FullAccess };
          };

          user.claim = claim;

          return user;
        });
      });
    });
  }.bind(this));
};

Accessor.prototype.members = function(userId, query) {
  return this.list(_.assign({}, query, { userid: userId })).then(function(access) {
    var ids = access == null ? [] : _(access).pluck('memberId').value()
      , primary = access == null ? null : _(access).find({ primary: true });

    return Member.listByIds(ids).then(function(members) {
      if (members.length) {
        return members.map(function(member) {
          member.primary = (primary && member.id === primary.memberId);
          return member;
        });
      }
    });
  });
};

Accessor.prototype.setup = function(member) {
  var userId = member.createdBy || this.context.session.id;

  return this.add(member.id, userId);
};

Accessor.prototype.add = function(memberId, userId, right) {
  var context = this.context
    , claim = { entity: memberId, right: right };

  return request('users/users/' + userId, context).get().then(function(data) {
    var user = data.user;
    
    if (user == null) throw new errors.NotFoundError();

    return Member.get(memberId).then(function(member) {
      if (userId === member.createdBy) claim.right = Authorizer.permissions.FullAccess;
      
      return Access.setup(memberId, userId).then(function(access) {
        publish('user:claim', { user: userId, claim: claim }, context);

        user.claim = claim;
        return user;
      });
    });
  });
};

Accessor.prototype.remove = function(memberId, userId) {
  var context = this.context
    , None = Authorizer.permissions.None;

  return Member.get(memberId).then(function(member) {
    if (userId === member.createdBy) throw new errors.NotAuthorizedError();

    return Access.truncate({ memberId: memberId, userId: userId }).then(function() {
      publish('user:claim', { user: userId, claim: { entity: memberId, right: None }}, context);
    });
  });
};

Accessor.prototype.setPrimary = function(memberId, userId) {
  var context = this.context;

  return Member.get(memberId).then(function(member) {
    if (member == null) throw new errors.NotFoundError();

    return request('users/users/' + userId, context).get().then(function(data) {
      if (data.user == null) throw new errors.NotFoundError();

      return Access.updatePrimary(memberId, userId).then(function() {
        member.primary = true;
        return member;
      });
    });
  });
};

module.exports = Accessor;