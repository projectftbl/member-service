module.exports = function(league, user) {
  return {
    userId: user.id
  , statsId: league.leagueId
  , name: league.displayName
  , type: 'league'
  };
};