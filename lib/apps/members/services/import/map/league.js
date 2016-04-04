module.exports = function(league) {
  return {
    statsId: league.leagueId
  , name: league.displayName
  , additional: { 
      type: 'league'
    }
  };
};