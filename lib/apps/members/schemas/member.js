module.exports = {
  required: true
, type: 'object'
, properties: {
    email: { type: 'string' }
  , name: { type: 'string' }
  , userId: { type: 'string' }
  , statsId: { type: 'number' }
  , additional: { 
      type: 'object'
    }
  }
};