var users = require('@ftbl/users')
  , Importer = require('../lib/apps/members/services/import');

var importer = new Importer({ user: users({ name: 'system' }) });

importer.import().then(function() {
  process.exit(0);
})
.catch(function(err) {
  console.log(err);
  process.exit(1);
});