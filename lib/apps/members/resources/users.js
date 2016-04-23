var Accessor = require('../services/accessor');

module.exports = function(middleware, errors) {
  
  return { 
    post: function *(next) { 
      var accessor = new Accessor(this.context);

      this.status = 200; 
      this.body = { user: yield accessor.add(this.params.id, this.request.body.user).memberId };
    }
  };
};
