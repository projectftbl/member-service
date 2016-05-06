var _ = require('lodash')
  , Promise = require('bluebird')
  , parse = require('csv-parse/lib/sync')
  , users = require('@ftbl/users')
  , request = require('@ftbl/request');

var Importer = function(context) {
  if (this instanceof Importer === false) return new Importer(context);

  this.context = context;
};

Importer.prototype.importCsv = function(content) {
  var context = this.context
    , rows = parse(content, { columns: true });

  return Promise.map(rows, function(row) {
    return request('members/members', context).get({ statsid: row.statsId }).then(function(data) {
      if (data.members.length === 0) return;

      var member = data.members[0]
        , path = 'members/members/' + member.id + '/accounts';

      return request(path, context).get().then(function(data) {
        var accounts = data.accounts;

        if (_.find(accounts, { network: row.network, handle: row.handle })) return;

        var account = { memberId: member.id, network: row.network, handle: row.handle };

        return request(path, context).post({ account: account });
      });
    });

  });
};

module.exports = Importer;