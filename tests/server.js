const getPort = require('get-port')
const http = require('http')
const fs = require('fs')

;(async () => {
  const port = await getPort()
  const server = http.createServer(function (req, res) {
    if (req.url === '/echo' && req.method === 'POST') {
      let data = ''
      req.on('data', chunk => {
        data += chunk.toString()
      })
      req.on('end', () => {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
          'Content-Length': Buffer.byteLength(data)
        })
        res.end(data)
      })
    } else if (req.url === '/cat.png') {
      let buffer = fs.readFileSync(`${__dirname}/cat.png`)
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': buffer.byteLength
      })
      res.write(buffer)
      res.end()
    } else {
      const body = 'Hello World'

      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(body)
      })
      res.write(body)
      res.end()
    }
    this.close()
  }).listen(port, () => {
    process.send({ port: port })
  })
  await new Promise((resolve) => {
    server.on('close', () => {
      process.send({ event: 'serverClosed' })
      resolve()
    })
  })
})()
