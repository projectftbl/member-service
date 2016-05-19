var _ = require('lodash')
  , broadcast = require('@ftbl/bus').broadcast
  , sceneskope = require('@ftbl/sceneskope')
  , Follower = require('../repositories/follower')
  , Member = require('../repositories/member');

var Follow = function(context) {
  if (this instanceof Follow === false) return new Follow(context);

  this.context = context;
};

Follow.prototype.follow = function(member, follower) {
  var data = { member: member, friend: follower };
  return Follower.create(data).then(function(follow) {
    broadcast('member:follow', follow, context);
    sceneskope('member:follow:create', follow, context);
    return Member.get(follower);
  });
};

Follow.prototype.unfollow = function(member, follower) {
  var data = { member: member, friend: follower };
  return Follower.remove(data).then(function() {
    broadcast('member:unfollow', data, context);
    sceneskope('member:follow:delete', data, context);
  });
};

Follow.prototype.followers = function(member) {
  return Follower.listFollowers(member).then(function(follows) {
    var ids = _(follows).pluck('friend').value();

    return Member.listByIds(ids).then(function(members) {
      return follows.map(function(follow) {
        return _.assign({}, follow, { friend: _.find(members, { id: follow.friend }) });
      });
    });
  });
};

Follow.prototype.following = function(follower) {
  return Follower.listFollowing(follower).then(function(follows) {
    var ids = _(follows).pluck('member').value();

    return Member.listByIds(ids).then(function(members) {
      return follows.map(function(follow) {
        return _.assign({}, follow, { member: _.find(members, { id: follow.member }) });
      });
    });
  });
};

module.exports = Follow;