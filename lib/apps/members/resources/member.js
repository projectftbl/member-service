var Finder = require('../services/finder');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var finder = new Finder(this.context)
        , member = yield finder.get(this.params.id);

      if (member == null) throw new errors.NotFoundError();

      this.status = 200;
      this.body = { member: member };
    }
   
  , put: function *(next) { 
      this.status = 200; 
    }
   
  , delete: function *(next) { 
      this.status = 200; 
    }
  };
};
