var Connector = require('./connector');

var TYPE = 'friends';

var Friend = function(context) {
  if (this instanceof Follow === false) return new Follow(context);

  this.connector = new Connector(context);
};

Friend.prototype.friend = function(member, friend) {
  return this.connector.connect(member, { memberId: friend, type: TYPE });
};

Friend.prototype.unfriend = function(member, friend) {
  return this.connector.disconnect(member, friend, TYPE);
};

Friend.prototype.list = function(member, query) {
  return this.connector.list(member, TYPE, query);
};

module.exports = Friend;