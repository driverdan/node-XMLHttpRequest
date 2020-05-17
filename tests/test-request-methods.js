const chai = require('chai')
const dirtyChai = require('dirty-chai')
chai.use(dirtyChai)
const expect = chai.expect
const http = require('http')
const getPort = require('get-port')
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest

describe('XMLHttpRequest request methods', () => {
  const methods = ['GET', 'POST', 'HEAD', 'PUT', 'DELETE']
  for (const method of methods) {
    it(`should set and get ${method} method`, async () => {
      const port = await getPort()
      let requestMethod = ''
      let requestUrl = ''
      const server = http.createServer(function (req, res) {
        requestMethod = req.method
        requestUrl = req.url
        // Check request method and URL
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
      }).listen(port)

      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (method === 'HEAD') {
            expect(this.responseText).to.equal('')
          } else {
            expect(this.responseText).to.equal('Hello World')
          }
        }
      }
      const url = `http://localhost:${port}/${method}`
      xhr.open(method, url)
      xhr.send()

      await new Promise((resolve) => {
        server.on('close', () => {
          resolve()
        })
      })

      expect(requestMethod).to.equal(method)
      expect(requestUrl).to.equal('/' + method)
    })
  }
})
