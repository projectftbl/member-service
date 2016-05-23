var _ = require('lodash')
  , broadcast = require('@ftbl/bus').broadcast
  , sceneskope = require('@ftbl/sceneskope')
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
    broadcast('member:friend', data, context);
    sceneskope('member:follow:create', data, context);
  });
};

var removeFriend = function(member, friend, context) {
  var data = { member: member, friend: friend };
  return Follower.truncate(data).then(function() {
    broadcast('member:unfriend', data, context);
    sceneskope('member:follow:delete', data, context);
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
  return Follower.listFriends(member).then(function(follows) {
    var ids = _(follows).pluck('member').value().concat(_(follows).pluck('friend').value());

    return Member.listByIds(ids).then(function(members) {
      return follows.map(function(follow) {
        return _.assign({}, follow, { friend: _.find(members, { id: follow.friend }) });
      });
    });
  });
};

module.exports = Friend;