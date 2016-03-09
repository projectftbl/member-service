module.exports = {
  required: true
, type: 'object'
, properties: {
    email: { type: 'string' }
  , name: { type: 'string' }
  , userId: { required: true, type: 'string' }
  }
};