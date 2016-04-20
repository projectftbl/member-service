module.exports = {
  required: true
, type: 'object'
, properties: {
    memberId: { required: true, type: 'string' }
  , network: { required: true, type: 'string' }
  , networkId: { type: 'string' }
  , link: { type: 'string' }
  , about: { type: 'string' }
  , token: { type: 'string' }
  , refresh: { type: 'string' }
  , secret: { type: 'string' }
  , email: { type: 'string' }
  , photo: { type: 'string' }
  , name: { type: 'string' }
  , handle: { type: 'string' }
  , type: { type: 'string' }
  }
};