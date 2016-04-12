var _ = require('lodash')
  , Promise = require('bluebird')
  , Creator = require('../creator')
  , Connector = require('../connector')
  , Finder = require('../finder')
  , stats = require('@ftbl/stats');

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
  return this.finder.list({ statsid: member.statsId }).then(function(members) {
    if (members.length) return members[0];

    return this.creator.create(member);
  }.bind(this));
};

var connect = function(member, connectTo, type) {
  return this.connector.connections(member, type).then(function(connections) {
    var connection = connections.find(function(connection) {
      return connection.connectTo === connectTo;
    });

    if (connection == null) return this.connector.connect(member, { memberId: connectTo, type: type });
  }.bind(this));
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

Importer.prototype.import = function() {
  var that = this;

  return Promise.map(LEAGUES, function(id) {

    return league(id).then(function(league) {
      if (league == null) return;

      return createMember.call(that, mapLeagueToMember(league)).then(function(leagueMember) {

        return teams(league).then(function(teams) {
          if (teams == null) return;

          var setupTeam = function(team) {
            return createMember.call(that, mapTeamToMember(team))

            .then(function(teamMember) {
              return connectTeamToLeague.call(that, teamMember, leagueMember).then(function() {

                return players(league, team).then(function(players) {
                  if (players == null) return;

                  var setupPlayer = function(player) {
                    return createMember.call(that, mapPlayerToMember(player)).then(function(playerMember) {
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
};

module.exports = Importer;