var _ = require('lodash')
  , Finder = require('../services/finder')
  , Creator = require('../services/creator');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var finder = new Finder(this.context);
    
      this.status = 200; 
      this.body = { accounts: yield finder.list(this.request.query) };
    }
    
  , post: function *(next) {
      var creator = new Creator(this.context);
      
      var account = yield creator.create(this.request.body.account);

      this.status = 200;
      this.body = _(account).isArray() ? { accounts: account } : { account: account };
    }
  };
};