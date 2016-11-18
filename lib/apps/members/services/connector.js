var _ = require('lodash')
  , errors = require('@recipher/errors')
  , broadcast = require('@recipher/bus').broadcast
  , Connection = require('../repositories/connection')
  , Member = require('../repositories/member');

var Connector = function(context) {
  if (this instanceof Connector === false) return new Connector(context);

  this.context = context;
};

Connector.prototype.connect = function(member, connection) {
  var context = this.context
    , data = { member: member, connectedTo: connection.memberId, type: connection.type };
  
  return Connection.find(data).then(function(connections) {
    if (connections.length) throw new errors.DuplicateError;

    return Connection.create(data).then(function(connection) {
      broadcast('member:connect', data, context);

      return Member.get(connection.connectedTo).then(function(member) {
        return _.assign({}, connection, { connectedTo: member });
      });
    });
  });
};

Connector.prototype.disconnect = function(member, connection, type) {
  var data = { member: member, connectedTo: connection, type: type };
  return Connection.truncate(data).then(function() {
    broadcast('member:disconnect', data, this.context);
  }.bind(this));
};

var populate = function(connections) {
  var ids = _(connections).pluck('member').value().concat(_(connections).pluck('connectedTo').value());

  return Member.listByIds(ids).then(function(members) {
    return connections.map(function(connection) {
      var member = _.find(members, { id: connection.member })
        , connectedTo = _.find(members, { id: connection.connectedTo });

      return _.assign({}, connection, { member: member, connectedTo: connectedTo });
    });
  });
};

Connector.prototype.list = function(member, type, options) {
  return Connection.listForType(member, type, options).then(populate);
};

Connector.prototype.connections = function(member, type, options) {
  return Connection.listByMemberForType(member, type, options).then(populate);
};

Connector.prototype.connectedTo = function(member, type, options) {
  return Connection.listByConnectedToForType(member, type, options).then(populate);
};

module.exports = Connector;