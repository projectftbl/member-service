var log = require('@ftbl/log')
  , Connector = require('../services/connect');

var Listener = function(queue) {
  if (this instanceof Listener === false) return new Listener(queue);

  this.queue = queue;
};

var logError = function(err) {
  log.error(err.message, err.stack);
};

Listener.prototype.listen = function() {
  this.queue.on('data', function(account, options) {
    var connector = new Connector(options);
    connector.connect(account);
  });

  this.queue.on('error', logError);

  this.queue.listen('member.account');
};

module.exports = Listener;