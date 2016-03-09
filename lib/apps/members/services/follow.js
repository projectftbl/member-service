var _ = require('lodash')
  , Follower = require('../repositories/follower')
  , Member = require('../repositories/member');

var Follow = function(context) {
  if (this instanceof Follow === false) return new Follow(context);

  this.context = context;
};

Follow.prototype.follow = function(member, follower) {
  return Follower.create({ member: member, follower: follower }).then(function() {
    return Member.get(follower);
  });
};

Follow.prototype.unfollow = function(member, follower) {
  return Follower.remove({ member: member, follower: follower });
};

Follow.prototype.followers = function(member) {
  return Follower.find({ member: member }).then(function(followers) {
    return Member.listByIds(_(followers).pluck('follower').value());
  });
};

Follow.prototype.followeds = function(follower) {
  return Follower.find({ follower: follower }).then(function(followeds) {
    return Member.listByIds(_(followeds).pluck('member').value());
  });
};

module.exports = Follow;