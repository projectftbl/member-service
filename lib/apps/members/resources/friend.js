var Friend = require('../services/friend');

module.exports = function(middleware, errors) {
  
  return { 
    delete: function *(next) { 
      var friend = new Friend(this.context);

      this.status = 204; 

      yield friend.unfriend(this.params.id, this.params.friend);
    }
  };
};
