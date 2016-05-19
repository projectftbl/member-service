var request = require('@ftbl/request');

module.exports = function(context) {
  return request('users/users', context).get({ handle: 'system' }).then(function(data) {
    if (data.users.length) return data.users[0];

    var user = { name: 'System', email: 'johnny.hall@projectftbl.com' };

    return request('users/users', context).post({ user: user }).then(function(data) {
      return data.user;
    });
  });
};