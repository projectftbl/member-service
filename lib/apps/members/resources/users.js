var Accessor = require('../services/accessor');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var accessor = new Accessor(this.context);

      this.status = 200; 
      this.body = { 
        users: yield accessor.users(this.params.id, this.request.query) 
      , meta: { total: yield accessor.total({ memberId: this.params.id }) }
      };
    }
    
  , post: function *(next) { 
      var accessor = new Accessor(this.context);

      this.status = 200; 
      this.body = { user: yield accessor.add(this.params.id, this.request.body.user, this.request.body.right) };
    }
  };
};
