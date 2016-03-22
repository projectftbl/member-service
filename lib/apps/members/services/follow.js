var _ = require('lodash')
  , broadcast = require('@ftbl/bus').broadcast
  , Follower = require('../repositories/follower')
  , Member = require('../repositories/member');

var Follow = function(context) {
  if (this instanceof Follow === false) return new Follow(context);

  this.context = context;
};

Follow.prototype.follow = function(member, follower) {
  var data = { member: member, friend: follower };
  return Follower.create(data).then(function() {
    broadcast('member.follow', data, context);
    return Member.get(follower);
  });
};

Follow.prototype.unfollow = function(member, follower) {
  var data = { member: member, friend: follower };
  return Follower.remove(data).then(function() {
    broadcast('member.follow', data, context);
  });
};

Follow.prototype.followers = function(member) {
  return Follower.find({ member: member }).then(function(followers) {
    return Member.listByIds(_(followers).pluck('friend').value());
  });
};

Follow.prototype.followeds = function(follower) {
  return Follower.find({ friend: follower }).then(function(followeds) {
    return Member.listByIds(_(followeds).pluck('member').value());
  });
};

module.exports = Follow;