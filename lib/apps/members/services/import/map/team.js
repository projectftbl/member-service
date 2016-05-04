module.exports = function(team, user) {
  return {
    userId: user.id
  , statsId: team.teamId
  , name: team.displayName
  , type: 'team'
  , additional: {
      country: team.country.name
    , venue: team.venue.name
    , city: team.venue.city
    }
  };
};