var inherits = require('util').inherits
  , Base = require('@recipher/store').Repository
  , schema = require('../schemas/connection');

var NAME = 'connection';

var Repository = function() {
  if (this instanceof Repository === false) return new Repository;

  Base.call(this, NAME, schema);
};

inherits(Repository, Base);

Repository.prototype.listForType = function(member, type, options) {
  var query = type == null
    ? function(conn) { return conn('member').eq(member).or(conn('connectedTo').eq(member)); }
    : function(conn) { return conn('member').eq(member).or(conn('connectedTo').eq(member)).and(conn('type').eq(type)); };

  return this.find(query, options);
};

Repository.prototype.listByMemberForType = function(member, type, options) {
  var query = type == null
    ? function(conn) { return conn('member').eq(member); }
    : function(conn) { return conn('member').eq(member).and(conn('type').eq(type)); };

  return this.find(query, options);
};

Repository.prototype.listByConnectedToForType = function(connectedTo, type, options) {
  var query = type == null
    ? function(conn) { return conn('connectedTo').eq(connectedTo); }
    : function(conn) { return conn('connectedTo').eq(connectedTo).and(conn('type').eq(type)); };

  return this.find(query, options);
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
