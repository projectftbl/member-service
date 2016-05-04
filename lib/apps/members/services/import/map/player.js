module.exports = function(player, user) {
  return {
    userId: user.id
  , statsId: player.playerId
  , name: [ player.firstName, player.lastName ].join(' ')
  , type: 'player'
  , additional: {
      height: player.height.centimeters
    , weight: player.weight.kilograms
    , dob: new Date(player.birth.birthDate.year, player.birth.birthDate.month, player.birth.birthDate.date)
    , country: player.nationality.name
    , shirt: player.uniform
    }
  };
};