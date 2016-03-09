var Finder = require('../services/finder');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var finder = new Finder(this.context)
        , account = yield finder.get(this.params.id);

      if (account == null) throw new errors.NotFoundError();
    
      this.status = 200; 
      this.body = { account: account }
    }
    
  , put: function *(next) {
      this.status = 200;
      this.body = this.request.body;
    }
   
  , delete: function *(next) {
      this.status = 200;
      this.body = this.request.body;
    }
  };
};