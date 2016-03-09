var Follow = require('../services/follow');

module.exports = function(middleware, errors) {
  
  return { 
    delete: function *(next) { 
      var follow = new Follow(this.context);

      this.status = 204; 

      yield follow.unfollow(this.params.id, this.params.follower);
    }
  };
};
