var _ = require('lodash')
  , Promise = require('bluebird')
  , facebook = require('@recipher/social').facebook
  , Friend = require('../friend')
  , Account = require('../../../accounts/services/finder');

module.exports = Promise.method(function(account, context) {
  if (account.type === 'page') return account;

  var finder = new Account(context)
    , friend = new Friend(context);

  return facebook.friends(account.networkId, account.token).then(function(friends) {
    return Promise.all(friends.map(function(f) {
      return finder.list({ networkid: f.id }).then(function(accounts) {
        if (accounts.length === 0) return;

        return friend.friend(_(accounts).first().memberId, account.memberId);
      });
    }));
  });
});