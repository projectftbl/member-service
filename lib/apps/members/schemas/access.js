module.exports = {
  required: true
, type: 'object'
, properties: {
    memberId: { required: true, type: 'string' }
  , userId: { required: true, type: 'string' }
  , primary: { type: 'boolean' }
  , claims: { 
      type: 'array'
    , items: {
        type: 'object'
      , properties: {
          thing: { type: 'string' }
        , right: { type: 'number' }
        }
      }
    }
  }
};