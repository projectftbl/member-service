var _ = require('lodash')
  , Promise = require('bluebird')
  , moment = require('moment')
  , csv = require('csv-stringify')
  , Member = require('../repositories/member')
  , Account = require('../../accounts/services/finder');

var HEADER = [ 'Member Name', 'Joined On', 'Referrer Code', 'Accounts' ];

var Generator = function(context) {
  if (this instanceof Generator === false) return new Generator(context);

  this.context = context;
};

var list = Promise.method(function(query) {
  if (query.ids) return Member.listByIds(query.ids, query);
  if (query.user) return Member.listByUserId(query.user, query);
  if (query.userid) return Member.listByUserId(query.userid, query);
  if (query.statsid) return Member.listByStatsId(query.statsid, query);

  return Member.find({}, query);
});

Generator.prototype.generate = function(query) {
  var account = new Account(this.context)
    , stringify = Promise.promisify(csv);
  
  var populate = function(member) {
    return account.list({ memberid: member.id }).then(function(accounts) {
      return _.assign({}, member, { accounts: accounts });
    });
  };
  
  var toArray = function(members) {
    return members.map(function(member) {
      var descriptor = function(account) {
        var description = account.network + ': ' + (account.networkId || account.link);
        if (account.name) description += ' (' + account.name + ')';
        return description;
      };

      return [ 
        member.name
      , moment(member.joinedAt).format('Do  MMM YYYY')
      , member.referrerCode || '' ].concat(member.accounts.map(descriptor));
    });
  };

  var insertHeader = function(members) {
    members.splice(0, 0, HEADER);
    return members;
  };

  return list(query).then(function(members) {
    return Promise.map(members, populate).then(function(members) {
      return stringify(insertHeader(toArray(members)));
    });
  });
};

module.exports = Generator;