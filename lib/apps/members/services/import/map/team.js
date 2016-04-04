module.exports = function(team) {
  return {
    statsId: team.teamId
  , name: team.displayName
  , additional: {
      country: team.country.name
    , venue: team.venue.name
    , city: team.venue.city
    , type: 'team'
    }
  };
};