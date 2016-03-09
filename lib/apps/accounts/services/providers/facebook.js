var facebook = require('@ftbl/social').facebook;

module.exports = function(authentication) {
  return facebook.user(authentication.token).then(function(user) {
    if (user == null) return;
    
    return {
      networkId: user.id
    , photo: user.picture.data.url
    , name: user.name
    , gender: user.gender
    , email: user.email
    , link: account.link
    , token: authenticationtoken
    };
  });
};
