var Finder = require('../services/finder')
  , Editor = require('../services/editor');

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
      var editor = new Editor(this.context);

      this.status = 200; 
      this.body = { member: yield editor.edit(this.params.id, this.request.body.member) };
    }
   
  , delete: function *(next) { 
      var editor = new Editor(this.context);

      yield editor.remove(this.params.id);

      this.status = 204; 
    }
  };
};
