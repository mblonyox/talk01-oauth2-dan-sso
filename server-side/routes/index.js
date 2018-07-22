const { Router } = require('express')
const twitter = require('./twitter')

const router = new Router()

router.get('/', (req, res, next) => {
  res.render('index')
})

router.use('/twitter', twitter)

module.exports = router
