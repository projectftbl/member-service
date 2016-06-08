var Connector = require('./connector');

var TYPE = 'follows';

var Follow = function(context) {
  if (this instanceof Follow === false) return new Follow(context);

  this.connector = new Connector(context);
};

Follow.prototype.follow = function(member, follower) {
  return this.connector.connect(member, { memberId: follower, type: TYPE });
};

Follow.prototype.unfollow = function(member, follower) {
  return this.connector.disconnect(member, follower, TYPE);
};

Follow.prototype.followers = function(member, query) {
  return this.connector.connections(member, TYPE, query);
};

Follow.prototype.following = function(member, query) {
  return this.connector.connectedTo(member, TYPE, query);
};

module.exports = Follow;