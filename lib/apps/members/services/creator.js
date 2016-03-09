var _ = require('lodash')
  , Promise = require('bluebird')
  , errors = require('@ftbl/errors')
  , request = require('@ftbl/request')
  , broadcast = require('@ftbl/bus').broadcast
  , Member = require('../repositories/member')
  , AccountCreator = require('../../accounts/services/creator')
  , Friend = require('./friend');

var Creator = function(context) {
  if (this instanceof Creator === false) return new Creator(context);

  this.context = context;
};

Creator.prototype.create = function(data) {
  var context = this.context;

  return Member.create(data).then(function(member) {
    broadcast('member.create', member, context);
    return member;
  });
};

Creator.prototype.createFromUser = function(user) {
  var context = this.context
    , member = { email: user.email, name: user.name, userId: user.id };

  return this.create(member).then(function(member) {

    if (user.network == null) return member;

    var creator = new AccountCreator(context)
      , account = {
          memberId: member.id
        , networkId: user.networkId
        , network: user.network.name
        , token: user.network.token
        , secret: user.network.secret
        };

    return creator.create(account).then(function(account) {
      return member;
    });
  });
};

Creator.prototype.createFromUserId = function(id) {
  return request('users/users', this.context).get({ id: id }).then(function(data) {console.log(data)
    if (data.users.length === 0) throw new errors.NotFoundError();

    return this.createFromUser(data.users[0]);
  }.bind(this));
};

module.exports = Creator;