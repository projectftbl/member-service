var log = require('@ftbl/log')
  , Importer = require('../services/import');

var Job = function(scheduler) {
  if (this instanceof Job === false) return new Job(scheduler);

  this.scheduler = scheduler;
};

var logError = function(err) {
  log.error(err.message, err.stack);
};

Job.prototype.schedule = function() {
  //
};

module.exports = Job;