var _ = require('lodash')
  , broadcast = require('@ftbl/bus').broadcast
  , sceneskope = require('@ftbl/sceneskope')
  , Connection = require('../repositories/connection')
  , Member = require('../repositories/member');

var Connector = function(context) {
  if (this instanceof Connector === false) return new Connector(context);

  this.context = context;
};

Connector.prototype.connect = function(member, connection) {
  var data = { member: member, connectedTo: connection.memberId, type: connection.type };
  return Connection.create(data).then(function() {
    broadcast('member:connect', data, this.context);
    sceneskope('member:connection:create', data, this.context);

    return Member.get(connection.memberId);
  }.bind(this));
};

Connector.prototype.disconnect = function(member, connection, type) {
  var data = { member: member, connectedTo: connection, type: type };
  return Connection.truncate(data).then(function() {
    broadcast('member:disconnect', data, this.context);
    sceneskope('member:connection:delete', data, this.context);
  }.bind(this));
};

Connector.prototype.connections = function(member, type) {
  return Connection.listByMemberForType(member, type).then(function(connections) {
    var ids = _(connections).pluck('member').value().concat(_(connections).pluck('connectedTo').value());

    return Member.listByIds(ids).then(function(members) {
      return connections.map(function(connection) {
        var member = _.find(members, { id: connection.member })
          , connectedTo = _.find(members, { id: connection.connectedTo });

        return _.assign({}, connection, { member: member, connectedTo: connectedTo });
      });
    });
  });
};

module.exports = Connector;