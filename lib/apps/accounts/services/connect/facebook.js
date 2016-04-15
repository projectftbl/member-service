var Promise = require('bluebird')
  , facebook = require('@ftbl/social').facebook;

var mapToAccount = function(data) {
  return {
    networkId: data.id
  , photo: data.picture.data.url
  , name: data.name
  , gender: data.gender
  , about: data.about
  , link: data.link
  , token: data.access_token
  , type: data.type || 'page'
  };
};

module.exports = Promise.method(function(authentication) {
  if (authentication.accessToken == null) return authentication;

  return facebook.user(authentication.accessToken).then(function(user) {
    if (user == null) return;
    
    user.access_token = authentication.accessToken;
    user.type = 'profile';

    return facebook.accounts(user.id, authentication.accessToken).then(function(accounts) {
      return accounts.data.map(mapToAccount).concat(mapToAccount(user));
    });
  });
});
