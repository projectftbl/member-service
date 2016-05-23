var Promise = require('bluebird')
  , sceneskope = require('@ftbl/sceneskope')
  , request = require('@ftbl/request')
  , users = require('@ftbl/users');

var context = { user: users({ name: 'system' }) }
  , ids = {};

return request('members/members/search', context).get({ limit: 1000, q: '' }).then(function(data) {
  return Promise.map(data.members, function(member) {
    sceneskope('member:create', member, context);

    return request('members/members/' + member.id + '/connections', context).get().then(function(data) {
      return Promise.map(data.connections, function(connection) {
        var key = [ connection.type, connection.member.id, connection.connectedTo.id ].join(':');

        if (ids[key] || connection.member == null) {
          var url = 'members/members/' + connection.member.id + '/connection/' + connection.connectedTo.id;
          console.log(url);
          return request(url, context).delete({ type: connection.type }).catch(function(err) {
            console.log(err);
          });
        }

        var conn = { 
          id: connection.id
        , type: connection.type
        , member: connection.member.id 
        , connectedTo: connection.connectedTo.id 
        };

        ids[key] = conn;

        // return sceneskope('member:connection:create', conn, context);
      });
    });
  });
});