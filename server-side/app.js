const express = require('express')
const logger = require('morgan')
const body = require('body-parser')
const session = require('express-session')

const routes = require('./routes')

const app = express()

// Set view engine
app.set('view engine', 'pug')

// Use the middlewares
app.use(logger('dev'))
app.use(session({
  secret: 'rahasia',
  resave: false,
  saveUninitialized: true
}))
app.use(body.json())
app.use(body.urlencoded({ extended: false }))

app.use(routes)

// Static folder
app.use(express.static('public'))

// Not found handler
app.use((req, res, next) => {
  const err = new Error('Not found.')
  err.status = 404
  next(err)
})

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Unknown error.'
  res.status(status).render('error', {message})
})

module.exports = app
