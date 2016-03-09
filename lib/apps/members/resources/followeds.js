var Follow = require('../services/follow');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var follow = new Follow(this.context);
    
      this.status = 200; 
      this.body = { followeds: yield follow.followeds(this.params.id) };
    }
  };
};