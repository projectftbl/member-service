var twitter = require('@ftbl/social').twitter;

module.exports = function(authentication) {
  return twitter.verify(authentication).then(function(account) {
    if (user == null) return;
    
    return {
      networkId: account.id.toString()
    , photo: account.profile_image_url_https
    , name: account.name
    , link: account.link
    , token: authentication.token
    , secret: authentication.secret
    };
  });
};
