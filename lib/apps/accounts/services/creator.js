var _ = require('lodash')
  , Promise = require('bluebird')
  , errors = require('@ftbl/errors')
  , broadcast = require('@ftbl/bus').broadcast
  , Account = require('../repositories/account');

var Creator = function(context) {
  if (this instanceof Creator === false) return new Creator(context);

  this.context = context;
};

Creator.prototype.create = function(data) {
  var getAccount = require('./providers/' + data.network);

  return Account.create(getAccount(data)).then(function(account) {
    broadcast('member.account', account, this.context);
    return account;
  }.bind(this));
};

module.exports = Creator;