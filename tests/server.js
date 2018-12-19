const getPort = require('get-port')
const http = require('http')

;(async () => {
  const port = await getPort()
  const server = http.createServer(function (req, res) {
    const body = 'Hello World'

    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Length': Buffer.byteLength(body)
    })
    res.write(body)
    res.end()
    this.close()
  }).listen(port)
  if (process.send) {
    process.send({port: port});
  }
  await new Promise((resolve) => {
    server.on('close', () => {
      process.send({event: 'serverClosed'});
      resolve()
    })
  })
})()
