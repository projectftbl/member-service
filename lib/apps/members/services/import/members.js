var _ = require('lodash')
  , Promise = require('bluebird')
  , request = require('@ftbl/request')
  , getSystemUser = require('./user');

var Importer = function(context) {
  if (this instanceof Importer === false) return new Importer(context);

  this.context = context;
};

var createMember = Promise.method(function(member, members, user) {
  if (members.length) return members[0];
  
  var data = _.assign({}, member, { userId: user.id });

  return request('members/members', this.context).post({ member: data }).then(function(data) {
    return data.member;
  });
});

Importer.prototype.import = function(data) {
  var that = this;

  return getSystemUser(this.context).then(function(user) {

    return Promise.map(data, function(m) {
      return request('members/members/search', that.context).get({ q: m.name }).then(function(data) {
        return createMember.call(that, m, data.members, user).then(function(member) {
          var path = 'members/members/' + member.id + '/accounts';

          return request(path, that.context).get().then(function(data) {
            var accounts = data.accounts;

            return Promise.map(m.accounts, function(a) {
              if (_.find(accounts, { network: a.network, link: a.link })) return;

              var account = { memberId: member.id, network: a.network, link: a.link };

              return request(path, that.context).post({ account: account });
            });
          });
        });
      });
    });
  });
};

module.exports = Importer;