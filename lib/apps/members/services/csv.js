var _ = require('lodash')
  , Promise = require('bluebird')
  , moment = require('moment')
  , csv = require('csv-stringify')
  , request = require('@recipher/request')
  , Finder = require('./finder')
  , Account = require('../../accounts/services/finder');

var HEADER = [ 'Member Name', 'Joined On', 'Type', 'Email', 'Accounts' ];

var Generator = function(context) {
  if (this instanceof Generator === false) return new Generator(context);

  this.context = context;
};

Generator.prototype.generate = function(query, options) {
  var context = this.context
    , finder = new Finder(this.context)
    , account = new Account(this.context)
    , stringify = Promise.promisify(csv);
  
  var populate = function(member) {
    return account.list({ memberid: member.id }).then(function(accounts) {
      return request('users/users', context).get({ id: member.createdBy }).then(function(data) {
        return _.assign({}, member, { accounts: accounts }, { user: data.users.length && data.users[0] });
      });
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
      , moment(member.joinedAt).format('Do MMM YYYY')
      , member.type
      , member.user.email
    });
  };

  var insertHeader = function(members) {
    members.splice(0, 0, HEADER);
    return members;
  };

  return finder.search(query, options).then(function(members) {
    return Promise.map(members, populate).then(function(members) {
      return stringify(insertHeader(toArray(members)));
    });
  });
};

module.exports = Generator;