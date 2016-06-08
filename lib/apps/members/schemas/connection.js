module.exports = {
  required: true
, type: 'object'
, properties: {
    member: { required: true, type: 'string' }
  , connectedTo: { required: true, type: 'string' }
  , type: { 
      required: true
    , type: 'string'
    , enum: [ 
        'plays-for'
      , 'played-for'
      , 'manages'
      , 'managed'
      , 'member-of'
      , 'national-team' 
      , 'supports'
      , 'favourites'
      , 'follows'
      , 'friends'
      ] 
    }
  }
};