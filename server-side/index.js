const app = require('./app')
const http = require('http')
const portfinder = require('portfinder')

portfinder.getPortPromise({port: 3000})
  .then((port) => {
    app.set('port', port)
    const server = http.createServer(app)
    server.listen(port)
    server.on('listening', () => {
      console.log(`Listening on port: ${port}`)
      console.log(`Open browser:  http://127.0.0.1:${port}` )
    })
  })
  .catch(err => { throw err })
