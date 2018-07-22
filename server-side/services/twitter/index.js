const oauth = require('oauth')
const {consumerKey, consumerSecret, callbackUrl} = require('./consumer')

module.exports = new oauth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  consumerKey,
  consumerSecret,
  '1.0',
  callbackUrl,
  'HMAC-SHA1'
)