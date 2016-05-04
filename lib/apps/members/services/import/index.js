var _ = require('lodash')
  , Promise = require('bluebird')
  , request = require('@ftbl/request')
  , stats = require('@ftbl/stats')
  , Creator = require('../creator')
  , Connector = require('../connector')
  , Finder = require('../finder');

var mapLeagueToMember = require('./map/league')
  , mapTeamToMember = require('./map/team')
  , mapPlayerToMember = require('./map/player');

var LEAGUES = [ 39 ];

var Importer = function(context) {
  if (this instanceof Importer === false) return new Importer(context);

  this.context = context;

  this.finder = new Finder(context);
  this.creator = new Creator(context);
  this.connector = new Connector(context);
};

var createMember = function(member) {
  var context = this.context;

  return request('members/members', context).get({ statsid: member.statsId }).then(function(data) {
    if (data.members.length) return data.members[0];

    return request('members/members', context).post({ member: member }).then(function(data) {
      console.log(data.member);
      return data.member;
    });
  });
};

var connect = function(member, connectTo, type) {
  var context = this.context
    , url = 'members/members/' + member + '/connections';

  return request(url, context).get({ type: type }).then(function(data) {
    var connection = data.connections.find(function(connection) {
      return connection.connectTo === connectTo;
    });

    if (connection == null) {
      connection = { memberId: connectTo, type: type };
      return request(url, context).post({ connection: connection }).then(function(data) {
        return data.connection;
      });
    }
  });
};

var connectTeamToLeague = function(team, league) {
  return connect.call(this, team.id, league.id, 'member-of');
};

var connectPlayerToTeam = function(player, team) {
  return connect.call(this, player.id, team.id, 'plays-for');
};

// Temp to deal with API rate limits
var timeout = function(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
};

var league = function(id) {
  return timeout(1000).then(function() {
    return stats.league(id);
  });
};

var teams = function(league) {
  return timeout(1000).then(function() {
    return stats.teams(league);
  });
};

var players = function(league, team) { 
  return timeout(1000).then(function() {
    return stats.players(league, team);
  });
};

var getSystemUser = function(context) {
  return request('users/users', context).get({ handle: 'system' }).then(function(data) {
    if (data.users.length) return data.users[0];

    var user = { name: 'System', email: 'johnny.hall@projectftbl.com' };

    return request('users/users', context).post({ user: user }).then(function(data) {
      return data.user;
    });
  });
};

Importer.prototype.import = function() {
  var that = this;

  return getSystemUser(this.context).then(function(user) {

    return Promise.map(LEAGUES, function(id) {

      return league(id).then(function(league) {
        if (league == null) return;

        return createMember.call(that, mapLeagueToMember(league, user)).then(function(leagueMember) {

          return teams(league).then(function(teams) {
            if (teams == null) return;

            var setupTeam = function(team) {
              return createMember.call(that, mapTeamToMember(team, user))

              .then(function(teamMember) {
                return connectTeamToLeague.call(that, teamMember, leagueMember).then(function() {

                  return players(league, team).then(function(players) {
                    if (players == null) return;

                    var setupPlayer = function(player) {
                      return createMember.call(that, mapPlayerToMember(player, user)).then(function(playerMember) {
                        return connectPlayerToTeam.call(that, playerMember, teamMember);
                      });
                    };

                    return Promise.map(players, setupPlayer);
                  });
                });
              });
            };

            return Promise.mapSeries(teams, setupTeam);
          });

        });
      });

    });
  });
};

module.exports = Importer;