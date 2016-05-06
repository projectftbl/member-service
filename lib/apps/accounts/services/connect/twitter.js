var Promise = require('bluebird')
  , twitter = require('@ftbl/social').twitter;

module.exports = Promise.method(function(authentication) {

  if (authentication.token == null) {
    if (authentication.handle == null) return authentication;

    return twitter.user(authentication.handle).then(function(user) {
      if (user == null) return;
      
      return {
        networkId: user.id.toString()
      , photo: user.profile_image_url_https
      , name: user.name
      , link: 'https://www.twitter.com/' + user.screen_name
      , handle: user.screen_name
      , memberId: authentication.memberId
      , about: user.description
      };
    });
  }

  return twitter.verify(authentication).then(function(user) {
    if (user == null) return;
    
    return {
      networkId: user.id.toString()
    , photo: user.profile_image_url_https
    , name: user.name
    , link: 'https://www.twitter.com/' + user.screen_name
    , handle: user.screen_name
    , token: authentication.token
    , secret: authentication.secret
    , memberId: authentication.memberId
    , about: user.description
    };
  });
});
