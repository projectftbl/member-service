var Follow = require('../services/follow');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var follow = new Follow(this.context);
    
      this.status = 200; 
      this.body = { followers: yield follow.followers(this.params.id) };
    }
   
  , post: function *(next) { 
      var follow = new Follow(this.context);
    
      this.status = 200;
      this.body = { follower: yield follow.follow(this.params.id, this.request.body.follower) };
    }
  };
};