var _ = require('lodash')
  , Finder = require('../../accounts/services/finder')
  , Creator = require('../../accounts/services/creator');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var finder = new Finder(this.context)
        , query = _.assign({}, this.request.query, { member: this.params.id });

      this.status = 200; 
      this.body = { accounts: yield finder.list(query) };
    }
    
  , post: function *(next) {
      var creator = new Creator(this.context)
        , data = _.assign({}, this.request.body.account, { memberId: this.params.id })
        , account = yield creator.create(data);

      if (account == null || account.length === 0) throw new errors.NotFoundError();

      this.status = 200;
      this.body = _(account).isArray() ? { accounts: account } : { account: account };
    }
  };
};