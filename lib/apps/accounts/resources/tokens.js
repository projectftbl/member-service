var Tokens = require('../services/tokens');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var tokens = new Tokens(this.context);
    
      this.status = 200; 
      this.body = { tokens: yield tokens.random(this.request.query) };
    }
  };
};