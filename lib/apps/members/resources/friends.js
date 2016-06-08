var Friend = require('../services/friend');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var friend = new Friend(this.context);
    
      this.status = 200; 
      this.body = { friends: yield friend.list(this.params.id, this.request.query) };
    }
   
  , post: function *(next) { 
      var friend = new Friend(this.context);
    
      this.status = 200;
      this.body = { friend: yield friend.friend(this.params.id, this.request.body.friend) };
    }
  };
};