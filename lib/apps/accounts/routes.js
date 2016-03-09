module.exports = function(router, resource, middleware, errors) {
  var account = resource.account(middleware, errors)
    , accounts = resource.accounts(middleware, errors);

  router.get('/', accounts.get);
  router.post('/', accounts.post);

  router.get('/:id', account.get);
  router.put('/:id', account.put);
  router.delete('/:id', account.delete);
};
