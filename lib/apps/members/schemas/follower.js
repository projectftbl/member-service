module.exports = {
  required: true
, type: 'object'
, properties: {
    member: { required: true, type: 'string' }
  , friend: { required: true, type: 'string' }
  , mutual: { type: 'boolean' }
  }
};