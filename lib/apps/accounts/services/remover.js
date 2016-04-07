var broadcast = require('@ftbl/bus').broadcast
  , Account = require('../repositories/account');

var Remover = function(context) {
  if (this instanceof Remover === false) return new Remover(context);

  this.context = context;
};

Remover.prototype.remove = function(id) {
  var context = this.context;

  return Account.delete(id).then(function() {
    broadcast('member.account.delete', { id: id }, context);
  });
};

module.exports = Remover;