var Follow = require('../services/follow');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var follow = new Follow(this.context);
    
      this.status = 200; 
      this.body = { following: yield follow.following(this.params.id, this.request.query) };
    }
  };
};