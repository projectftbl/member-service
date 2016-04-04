var inherits = require('util').inherits
  , Base = require('@ftbl/store').Repository
  , schema = require('../schemas/follower');

var NAME = 'follower';

var Repository = function() {
  if (this instanceof Repository === false) return new Repository;

  Base.call(this, NAME, schema);
};

inherits(Repository, Base);

Repository.prototype.listFriends = function(member) {
  return this.find(function(follow) { 
    return follow('member').eq(member).or(follow('friend').eq(member)).and(follow('mutual').eq(true)); 
  });
};

Repository.prototype.listFollowers = function(member) {
  return this.find({ member: member });
};

Repository.prototype.listFollowing = function(member) {
  return this.find({ friend: member });
};

Repository.prototype.sanitize = function(follower) {
  if (follower == null) return;
  
  return follower;
};

Repository.prototype.clean = function(follower) {
  if (follower == null) return;

  return follower;
};

module.exports = new Repository;
