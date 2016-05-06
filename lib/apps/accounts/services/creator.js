var _ = require('lodash')
  , Promise = require('bluebird')
  , errors = require('@ftbl/errors')
  , broadcast = require('@ftbl/bus').broadcast
  , Account = require('../repositories/account');

var Creator = function(context) {
  if (this instanceof Creator === false) return new Creator(context);

  this.context = context;
};

var createLink = Promise.method(function(data, context) {
  if (data.link == null || data.link.length === 0) throw new errors.ValidationError();

  if (data.network === 'rss') data.schedule = 15;

  return Account.listByLink(data.link).then(function(accounts) {
    if (accounts.length) {
      if (accounts[0].memberId !== data.memberId) throw new errors.ValidationError();
      return accounts[0];
    }

    return Account.create(data).then(function(account) {
      broadcast('member:account', account, context);
      return account;
    });
  });
});

var create = function(data, authentication, context) {
  data.memberId = authentication.memberId;
  data.network = authentication.network;

  data.schedule = 15;

  return Account.listByNetworkId(data.networkId).then(function(accounts) {
    if (accounts.length) {
      if (accounts[0].memberId !== data.memberId) return;
      return Account.update(accounts[0].id, data);
    }

    return Account.create(data).then(function(account) {
      broadcast('member:account', account, context);
      return account;
    });
  });
};

Creator.prototype.create = function(authentication) {
  var context = this.context;

  if (authentication.network === 'rss' || authentication.network === 'page') {
    return createLink(authentication, context);
  }

  var connectAccount = require('./connect/' + authentication.network);

  return connectAccount(authentication).then(function(account) {
    if (account == null) return;

    // Support multiple accounts
    if (_(account).isArray()) {
      return Promise.map(account, function(data) {
        return create(data, authentication, context);
      })
      .then(_.compact);
    }

    return create(account, authentication, context);
  });
};

module.exports = Creator;