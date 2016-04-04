module.exports = {
  required: true
, type: 'object'
, properties: {
    memberId: { required: true, type: 'string' }
  , network: { required: true, type: 'string' }
  , networkId: { required: true, type: 'string' }
  , link: { type: 'string' }
  , token: { type: 'string' }
  , secret: { type: 'string' }
  , email: { type: 'string' }
  , photo: { type: 'string' }
  , name: { type: 'string' }
  , handle: { type: 'string' }
  }
};