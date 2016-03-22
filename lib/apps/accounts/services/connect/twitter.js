var Promise = require('bluebird')
  , twitter = require('@ftbl/social').twitter;

module.exports = Promise.method(function(authentication) {

  if (authentication.token == null) return authentication;

  return twitter.verify(authentication).then(function(user) {
    if (user == null) return;
    
    return {
      networkId: user.id.toString()
    , photo: user.profile_image_url_https
    , name: user.name
    , link: user.link
    , token: authentication.token
    , secret: authentication.secret
    , memberId: authentication.memberId
    };
  });
});
