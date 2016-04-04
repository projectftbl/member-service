var errors = require('@ftbl/errors')
  , request = require('@ftbl/request')
  , broadcast = require('@ftbl/bus').broadcast
  , Member = require('../repositories/member')
  , Account = require('../../accounts/services/creator');

var Creator = function(context) {
  if (this instanceof Creator === false) return new Creator(context);

  this.context = context;
};

Creator.prototype.create = function(data) {
  var context = this.context;

  if (data.userId && data.name == null && data.email == null) return this.createFromUserId(data.userId);

  return Member.create(data).then(function(member) {
    broadcast('member.create', member, context);
    return member;
  });
};

Creator.prototype.createFromUser = function(user) {
  var context = this.context;
  
  return this.create({ email: user.email, name: user.name, userId: user.id })

  .then(function(member) {

    if (user.network == null) return member;

    var creator = new Account(context)
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
  return request('users/users/' + id, this.context).get().then(function(data) {
    if (data.user == null) throw new errors.NotFoundError();

    return this.createFromUser(data.user);
  }.bind(this));
};

module.exports = Creator;