var _ = require('lodash')
  , Promise = require('bluebird')
  , twitter = require('@ftbl/social').twitter
  , Follow = require('../follow')
  , Account = require('../../../accounts/services/finder');

module.exports = function(account, context) {
  var finder = new Account(context)
    , follow = new Follow(context);

  return twitter.following(account.networkId, account).then(function(data) {

    return Promise.all(data.ids.map(function(id) {

      return finder.list({ networkid: id }).then(function(accounts) {

        if (accounts.length === 0) return;

        return follow.follow(_(accounts).first().memberId, account.memberId);
      });
    }));
  });
};