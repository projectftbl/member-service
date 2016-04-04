var inherits = require('util').inherits
  , Base = require('@ftbl/store').Repository
  , schema = require('../schemas/connection');

var NAME = 'connection';

var Repository = function() {
  if (this instanceof Repository === false) return new Repository;

  Base.call(this, NAME, schema);
};

inherits(Repository, Base);

Repository.prototype.listByMemberForType = function(member, type) {
  var query = type == null
    ? function(conn) { return conn('member').eq(member).or(conn('connectedTo').eq(member)); }
    : function(conn) { return conn('member').eq(member).or(conn('connectedTo').eq(member)).and(conn('type').eq(type)); };

  return this.find(query);
};

Repository.prototype.sanitize = function(connection) {
  if (connection == null) return;
  
  return connection;
};

Repository.prototype.clean = function(connection) {
  if (connection == null) return;

  return connection;
};

module.exports = new Repository;
