const chai = require('chai')
const dirtyChai = require('dirty-chai')
chai.use(dirtyChai)
const expect = chai.expect
const http = require('http')
const getPort = require('get-port')
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest

describe('XMLHttpRequest streaming', () => {
  it('should wait until the stream is finished', async () => {

    let bodyLength = 0

    function completeResponse (res, server, body) {
      res.end()
      bodyLength = body.length
      server.close()
    }

    const port = await getPort()
    const server = http.createServer(function (req, res) {
      const body = (req.method !== 'HEAD' ? ['Hello', 'World', 'Stream'] : [])

      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(body.join(''))
      })

      let nextPiece = 0
      const self = this
      const interval = setInterval(function () {
        if (nextPiece < body.length) {
          res.write(body[nextPiece])
          nextPiece++
        } else {
          completeResponse(res, self, body)
          clearInterval(interval)
        }
      }, 100) // nagle may put writes together, if it happens rise the interval time
    }).listen(port)

    const xhr = new XMLHttpRequest()

    // Track event calls
    let onreadystatechange = false
    let readystatechange = false
    let removed = true
    let loadCount = 0

    const removedEvent = function () {
      removed = false
    }

    xhr.onreadystatechange = function () {
      onreadystatechange = true
    }

    xhr.addEventListener('readystatechange', function () {
      readystatechange = true
      if (xhr.readyState === xhr.LOADING) {
        loadCount++
      }
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
    expect(loadCount).to.equal(bodyLength)
  })
})


