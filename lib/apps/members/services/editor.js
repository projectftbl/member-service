var broadcast = require('@recipher/bus').broadcast
  , Member = require('../repositories/member')

var Editor = function(context) {
  if (this instanceof Editor === false) return new Editor(context);

  this.context = context;
};

Editor.prototype.edit = function(id, data) {
  var context = this.context;

  return Member.update(id, data).then(function(member) {
    broadcast('member:update', member, context);
    return member;
  });
};

Editor.prototype.remove = function(id) {
  var context = this.context;

  return Member.delete(id).then(function() {
    broadcast('member:remove', { id: id }, context);
  });
};

module.exports = Editor;