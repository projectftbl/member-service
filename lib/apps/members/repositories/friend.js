var inherits = require('util').inherits
  , Base = require('@ftbl/store').Repository
  , schema = require('../schemas/friend');

var NAME = 'friend';

var Repository = function() {
  if (this instanceof Repository === false) return new Repository;

  Base.call(this, NAME, schema);
};

inherits(Repository, Base);

Repository.prototype.sanitize = function(friend) {
  if (friend == null) return;
  
  return friend;
};

Repository.prototype.clean = function(friend) {
  if (friend == null) return;

  return friend;
};

module.exports = new Repository;
