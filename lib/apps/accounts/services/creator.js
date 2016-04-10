var _ = require('lodash')
  , Promise = require('bluebird')
  , errors = require('@ftbl/errors')
  , broadcast = require('@ftbl/bus').broadcast
  , Account = require('../repositories/account');

var Creator = function(context) {
  if (this instanceof Creator === false) return new Creator(context);

  this.context = context;
};

Creator.prototype.create = function(authentication) {
  var context = this.context
    , connectAccount = require('./connect/' + authentication.network);

  return connectAccount(authentication).then(function(data) {

    data.memberId = authentication.memberId;
    data.network = authentication.network;

    return Account.listByNetworkId(data.networkId).then(function(accounts) {
      if (accounts.length) return Account.update(accounts[0].id, data);

      return Account.create(data).then(function(account) {
        broadcast('member.account', account, context);
        return account;
      });
    });
  });
};

module.exports = Creator;