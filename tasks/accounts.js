var fs = require('fs')
  , users = require('@ftbl/users')
  , Importer = require('../lib/apps/members/services/import/accounts');

var importer = new Importer({ user: users({ name: 'system' }) });

importer.importCsv(fs.readFileSync(__dirname + '/accounts.csv', 'utf8')).then(function() {
  process.exit(0);
})
.catch(function(err) {
  console.log(err);
  process.exit(1);
});