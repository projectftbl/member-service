var Accessor = require('../services/accessor');

module.exports = function(middleware, errors) {
  
  return { 
    put: function *(next) { 
      var accessor = new Accessor(this.context);

      this.status = 200; 
      this.body = { member: yield accessor.setPrimary(this.params.id, this.params.user) };
    }
    
  , delete: function *(next) { 
      var accessor = new Accessor(this.context);

      this.status = 204; 

      yield accessor.remove(this.params.id, this.params.user);
    }
  };
};
