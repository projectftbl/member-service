var Creator = require('../services/creator')
  , Finder = require('../services/finder');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var finder = new Finder(this.context);

      this.status = 200;
      this.body = { members: yield finder.list(this.request.query) };
    }
   
  , post: function *(next) {
      var creator = new Creator(this.context);

      var member = this.request.body.user
        ? yield creator.createFromUser(this.request.body.user)
        : yield creator.create(this.request.body.member);
      
      this.status = 200;
      this.body = { member: member };
    }
  };
};