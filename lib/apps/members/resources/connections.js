var Connector = require('../services/connector');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var connector = new Connector(this.context)
        , type = this.request.query.type;

      this.status = 200; 
      this.body = { type: type, connections: yield connector.connections(this.params.id, type) };
    }
   
  , post: function *(next) { 
      var connector = new Connector(this.context);
    
      this.status = 200;
      this.body = { connection: yield connector.connect(this.params.id, this.request.body.connection) };
    }
  };
};