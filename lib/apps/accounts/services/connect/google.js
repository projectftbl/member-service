var Promise = require('bluebird');

module.exports = Promise.method(function(authentication) {

  if (authentication.token == null) return authentication;

  var account = authentication.data;

  return {
    networkId: authentication.id
  , email: account.email
  , photo: account.picture
  , name: account.name
  , token: authentication.token
  , link: account.link
  };
});
