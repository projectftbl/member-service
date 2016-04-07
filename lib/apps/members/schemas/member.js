module.exports = {
  required: true
, type: 'object'
, properties: {
    name: { type: 'string' }
  , userId: { type: 'string' }
  , statsId: { type: 'number' }
  , type: { type: 'string', enum: [ 'fan', 'team', 'player' ] }
  , additional: { 
      type: 'object'
    }
  }
};