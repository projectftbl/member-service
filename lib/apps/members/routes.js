module.exports = function(router, resource, middleware, errors) {
  var authorize = middleware.authorize;

  var members = resource.members(middleware, errors)
    , member = resource.member(middleware, errors)
    , accounts = resource.accounts(middleware, errors)
    , friend = resource.friend(middleware, errors)
    , friends = resource.friends(middleware, errors)
    , connection = resource.connection(middleware, errors)
    , connections = resource.connections(middleware, errors)
    , follower = resource.follower(middleware, errors)
    , followers = resource.followers(middleware, errors)
    , following = resource.following(middleware, errors)
    , csv = resource.csv(middleware, errors)
    , search = resource.search(middleware, errors);
  
  router.get('/', members.get);
  router.post('/', authorize('member'), members.post);
  
  router.get('/search/:q?', authorize('member'), search.get);
  router.get('/csv/:q?', authorize('member'), csv.get);
  
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
  
  router.get('/:id/following', following.get);
  
  router.get('/:id/connections', connections.get);
  router.post('/:id/connections', connections.post);
  router.delete('/:id/connection/:connection', connection.delete);
};
