const { Router } = require('express')
const twitter = require('../services/twitter')

const router = new Router()

router.get('/', (req, res, next) => {
  if (!req.session.twitterScreenName) return res.redirect('/twitter/connect')
  res.render('welcome', {name: req.session.twitterScreenName})
})

router.get('/connect', (req, res, next) => {
  twitter.getOAuthRequestToken((error, token, secret, result) => {
    if (error) return next(new Error('Error getting OAuth request token.'))
    req.session.oauthRequestToken = token
    req.session.oauthRequestTokenSecret = secret
    return res.redirect("https://twitter.com/oauth/authenticate?oauth_token="+token)
  })
})

router.get('/callback', (req, res, next) => {
  const requestToken = req.session.oauthRequestToken
  const requestSecret = req.session.oauthRequestTokenSecret
  const verifier = req.query.oauth_verifier
  twitter.getOAuthAccessToken(requestToken, requestSecret, verifier, (error, token, secret, result) => {
    if (error) return next(new Error('Error getting OAuth access token.'))
    req.session.oauthAccessToken = token
    req.session.oauthAccessTokenSecret = secret
    req.session.twiterUserId = result.user_id
    req.session.twitterScreenName = result.screen_name
    return res.redirect('/twitter')
  })
})

module.exports = router
