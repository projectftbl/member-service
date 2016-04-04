var Importer = require('../lib/apps/members/services/import');

var importer = new Importer;

importer.import().then(function() {
  process.exit(0)
});