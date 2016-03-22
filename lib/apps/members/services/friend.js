var _ = require('lodash')
  , broadcast = require('@ftbl/bus').broadcast
  , errors = require('@ftbl/errors')
  , Follower = require('../repositories/follower')
  , Member = require('../repositories/member');

var Friend = function(context) {
  if (this instanceof Friend === false) return new Friend(context);

  this.context = context;
};

var createFriend = function(member, friend, context) {
  var data = { member: member, friend: friend, mutual: true };
  return Follower.create(data).then(function(friend) {
    broadcast('member.friend', data, context);
  });
};

var removeFriend = function(member, friend, context) {
  var data = { member: member, friend: friend };
  return Follower.remove(data).then(function() {
    broadcast('member.unfriend', data, context);
  });
};

Friend.prototype.friend = function(member, friend) {
  var context = this.context;

  return createFriend(member, friend, context).then(function() {
    return createFriend(friend, member, context);
  });
};

Friend.prototype.unfriend = function(member, friend) {
  var context = this.context;

  return removeFriend(member, friend, context).then(function() {
    return removeFriend(friend, member, context);
  });
};

Friend.prototype.list = function(member) {
  return Follower.find({ member: member, mutual: true }).then(function(friends) {
    return Member.listByIds(_(friends).pluck('friend').value());
  });
};

module.exports = Friend;