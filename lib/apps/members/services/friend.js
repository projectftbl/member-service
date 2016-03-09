var _ = require('lodash')
  , Promise = require('bluebird')
  , broadcast = require('@ftbl/bus').broadcast
  , errors = require('@ftbl/errors')
  , Friend = require('../repositories/friend')
  , Member = require('../repositories/member');

var Befriend = function(context) {
  if (this instanceof Befriend === false) return new Befriend(context);

  this.context = context;
};

var createFriend = function(member, friend, context) {
  return Friend.create({ member: member, friend: friend }).then(function(friend) {
    broadcast('member.friend', friend, context);
  });
};

var removeFriend = function(member, friend, context) {
  return Friend.remove({ member: member, friend: friend }).then(function() {
    broadcast('member.unfriend', { member: member, friend: friend }, context);
  });
};

Befriend.prototype.friend = function(member, friend) {
  var context = this.context;

  return createFriend(member, friend, context).then(function() {
    return Member.get(friend).then(function(p) {
      return createFriend(friend, member, _.assign({}, context, { session: { id: p.userId }}));
    });
  });
};

Befriend.prototype.unfriend = function(member, friend) {
  var context = this.context;

  return removeFriend(member, friend, context).then(function() {
    return Member.get(friend).then(function(p) {
      return removeFriend(friend, member, _.assign({}, context, { session: { id: p.userId }}));
    });
  });
};

Befriend.prototype.list = function(member) {
  return Friend.find({ member: member }).then(function(friends) {
    return Member.listByIds(_(friends).pluck('friend').value());
  });
};

module.exports = Befriend;