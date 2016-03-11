var Promise = require('bluebird')
  , facebook = require('@ftbl/social').facebook;

module.exports = Promise.method(function(authentication) {

  if (authentication.accessToken == null) return authentication;

  return facebook.user(authentication.accessToken).then(function(user) {
    if (user == null) return;
    
    return {
      networkId: user.id
    , photo: user.picture.data.url
    , name: user.name
    , gender: user.gender
    , link: user.link
    , token: authentication.accessToken
    };
  });
});
