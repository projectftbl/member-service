var _ = require('lodash')
  , url = require('url')
  , errors = require('@ftbl/errors')
  , request = require('@ftbl/request')
  , configuration = require('@ftbl/configuration')
  , broadcast = require('@ftbl/bus').broadcast
  , Member = require('../repositories/member')
  , Accessor = require('./accessor')
  , Account = require('../../accounts/services/creator');

var REFERRERS = configuration('referrers') || [];

var Creator = function(context) {
  if (this instanceof Creator === false) return new Creator(context);

  this.context = context;
};

var referrerCode = function(origin) {
  var host = url.parse(origin).host || ''
    , parts = host.split('.')
    , referrer = parts[0].toLowerCase();

  if (_(REFERRERS).contains(referrer)) return referrer;
};

Creator.prototype.create = function(data) {
  var context = this.context;

  if (data.userId && data.name == null) return this.createFromUserId(data.userId);

  data.joinedAt = new Date;
  data.createdBy = data.userId;
  data.referrerCode = referrerCode(context.origin);

  return Member.create(data).then(function(member) {
    return new Accessor(context).setup(member).then(function() {
      broadcast('member.create', member, context);
      return member;
    });
  });
};

Creator.prototype.createFromUser = function(user) {
  var context = this.context;
  
  return this.create({ name: user.name, createdBy: user.id })

  .then(function(member) {
    if (user.network == null) return member;

    var account = {
          memberId: member.id
        , networkId: user.networkId
        , network: user.network.name
        , token: user.network.token
        , secret: user.network.secret
        };

    return new Account(context).create(account).then(function(account) {
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