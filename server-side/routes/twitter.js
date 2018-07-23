const { Router } = require('express')
const twitter = require('../services/twitter')

const router = new Router()

router.get('/', (req, res, next) => {
  if (!req.session.twitter || !req.session.twitter.oauthAccessToken) return res.redirect('/twitter/connect')
  twitter.get(
    'https://api.twitter.com/1.1/account/verify_credentials.json',
    req.session.twitter.oauthAccessToken,
    req.session.twitter.oauthAccessTokenSecret,
    (error, data) => {
      if (error) return next(new Error('Error getting account info.'))
      data = JSON.parse(data)
      res.render('twitter', {data})
    }
  )
})

router.get('/connect', (req, res, next) => {
  twitter.getOAuthRequestToken((error, token, secret, result) => {
    if (error) return next(new Error('Error getting OAuth request token.'))
    req.session.twitter = {
      oauthRequestToken: token,
      oauthRequestTokenSecret: secret
    }
    return res.redirect("https://twitter.com/oauth/authenticate?oauth_token="+token)
  })
})

router.get('/callback', (req, res, next) => {
  const { oauthRequestToken, oauthRequestTokenSecret } = req.session.twitter
  const verifier = req.query.oauth_verifier
  twitter.getOAuthAccessToken(oauthRequestToken, oauthRequestTokenSecret, verifier, (error, token, secret, result) => {
    if (error) return next(new Error('Error getting OAuth access token.'))
    req.session.twitter.oauthAccessToken = token
    req.session.twitter.oauthAccessTokenSecret = secret
    req.session.twitter.userId = result.user_id
    req.session.twitter.screenName = result.screen_name
    return res.redirect('/twitter')
  })
})

router.get('/logout', (req, res, next) => {
  req.session.twitter = undefined
  return res.redirect('/')
})

module.exports = router
