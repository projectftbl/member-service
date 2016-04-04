var Connector = require('../services/connector');

module.exports = function(middleware, errors) {
  
  return { 
    delete: function *(next) { 
      var connector = new Connector(this.context);

      this.status = 204; 

      yield connector.disconnect(this.params.id, this.params.connection, this.request.query.type);
    }
  };
};
