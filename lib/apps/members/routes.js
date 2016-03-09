module.exports = function(router, resource, middleware, errors) {
  var members = resource.members(middleware, errors)
    , member = resource.member(middleware, errors)
    , accounts = resource.accounts(middleware, errors)
    , friend = resource.friend(middleware, errors)
    , friends = resource.friends(middleware, errors)
    , follower = resource.follower(middleware, errors)
    , followers = resource.followers(middleware, errors)
    , followeds = resource.followeds(middleware, errors);
  
  router.get('/', members.get);
  router.post('/', members.post);
  
  router.get('/:id', member.get);
  router.put('/:id', member.put);
  router.delete('/:id', member.delete);
  
  router.get('/:id/accounts', accounts.get);
  router.post('/:id/accounts', accounts.post);
  
  router.get('/:id/friends', friends.get);
  router.post('/:id/friends', friends.post);
  router.delete('/:id/friends/:friend', friend.delete);
  
  router.get('/:id/followers', followers.get);
  router.post('/:id/followers', followers.post);
  router.delete('/:id/followers/:follower', follower.delete);
  
  router.get('/:id/followeds', followeds.get);
};
