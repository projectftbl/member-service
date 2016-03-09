var log = require('@ftbl/log')
  , Creator = require('../services/creator');

var Listener = function(queue) {
  if (this instanceof Listener === false) return new Listener(queue);

  this.queue = queue;
};

var logError = function(err) {
  log.error(err.message, err.stack);
};

Listener.prototype.listen = function() {
  this.queue.on('data', function(user, options) {
    var creator = new Creator(options);
    creator.createFromUser(user);
  });

  this.queue.on('error', logError);

  this.queue.listen('user.create');
};

module.exports = Listener;