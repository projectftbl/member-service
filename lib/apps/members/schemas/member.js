module.exports = {
  required: true
, type: 'object'
, properties: {
    name: { type: 'string' }
  , statsId: { type: 'number' }
  , type: { type: 'string' }
  , bio: { type: 'string' }
  , createdBy: { type: 'string' }
  , joinedAt: { type: 'string', format: 'date-time' }
  , referrerCode: { type: 'string' }
  , additional: { 
      type: 'object'
    }
  }
};