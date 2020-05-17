const chai = require('chai')
const dirtyChai = require('dirty-chai')
chai.use(dirtyChai)
const expect = chai.expect
const http = require('http')
const getPort = require('get-port')
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest

describe('XMLHttpRequest events', () => {
  it('should return the value defined in the specification', async () => {
    const port = await getPort()
    const requestListener = function (req, res) {
      const body = (req.method !== 'HEAD' ? 'Hello World' : '')
      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(body)
      })
      // HEAD has no body
      if (req.method !== 'HEAD') {
        res.write(body)
      }
      res.end()
      this.close()
    }
    const server = http.createServer(requestListener).listen(port)

    let onreadystatechange = false
    let readystatechange = false
    let removed = true

    const removedEvent = function () {
      removed = false
    }

    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      onreadystatechange = true
    }

    xhr.addEventListener('readystatechange', function () {
      readystatechange = true
    })

    // This isn't perfect, won't guarantee it was added in the first place
    xhr.addEventListener('readystatechange', removedEvent)
    xhr.removeEventListener('readystatechange', removedEvent)

    xhr.open('GET', `http://localhost:${port}`)
    xhr.send()

    await new Promise((resolve) => {
      server.on('close', () => {
        resolve()
      })
    })

    expect(onreadystatechange).to.be.true()
    expect(readystatechange).to.be.true()
    expect(removed).to.be.true()
  })
})
