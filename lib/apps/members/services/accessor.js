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
    if (access == null || access.length === 0) return [];

    var ids = _(access).pluck('memberId').value()
      , primary = _(access).find({ primary: true });

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

var invite = function(memberId, email, right) {
  var that = this;

  return request('users/users', this.context).get({ email: email }).then(function(data) {
    if (data.users.length) return that.add(memberId, data.users[0], right);

    return request('users/users', that.context).post({ user: { email: email }}).then(function(data) {
      if (data == null) throw new errors.NotFoundError();

      return that.add(memberId, data.user, right);
    });
  });
};

Accessor.prototype.setup = function(member) {
  var userId = member.createdBy || this.context.session.id;

  return this.add(member.id, { id: userId });
};

Accessor.prototype.add = function(memberId, user, right) {
  var context = this.context
    , claim = { entity: memberId, right: right };

  if (user.id == null && user.email) return invite.call(this, memberId, user.email, right);

  return request('users/users/' + user.id, context).get().then(function(data) {
    var user = data.user;
    
    if (user == null) throw new errors.NotFoundError();

    return Member.get(memberId).then(function(member) {
      if (user.id === member.createdBy) claim.right = Authorizer.permissions.FullControl;
      
      return Access.setup(memberId, user.id).then(function(access) {
        publish('user:claim', { user: user.id, claim: claim }, context);

        user.claim = claim;
        return user;
      });
    });
  });
};

Accessor.prototype.remove = function(memberId, userId) {
  var context = this.context
    , None = Authorizer.permissions.Deny;

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