const chai = require('chai')
const dirtyChai = require('dirty-chai')
chai.use(dirtyChai)
const expect = chai.expect
const http = require('http')
const getPort = require('get-port')
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest

describe('XMLHttpRequest request headers', () => {
  it('should set and get request headers', async () => {
    const port = await getPort()
    let requestHeaderXTest = ''
    let requestHeaderUserAgent = ''
    let requestHeaderReferer = ''
    const server = http.createServer(function (req, res) {
      // Test setRequestHeader
      requestHeaderXTest = req.headers['x-test']
      // Test non-conforming allowed header
      requestHeaderUserAgent = req.headers['user-agent']
      // Test header set with blacklist disabled
      requestHeaderReferer = req.headers['referer']
      const body = 'Hello World'
      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(body),
        // Set cookie headers to see if they're correctly suppressed
        // Actual values don't matter
        'Set-Cookie': 'foo=bar',
        'Set-Cookie2': 'bar=baz',
        'Date': 'Thu, 30 Aug 2012 18:17:53 GMT',
        'Connection': 'close'
      })
      res.write('Hello World')
      res.end()

      this.close()
    }).listen(port)

    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        // Test getAllResponseHeaders()
        const headers = 'content-type: text/plain\r\ncontent-length: 11\r\ndate: Thu, 30 Aug 2012 18:17:53 GMT\r\nconnection: close'
        expect(this.getAllResponseHeaders()).to.equal(headers)

        // Test case insensitivity
        expect(this.getResponseHeader('Content-Type')).to.equal('text/plain')
        expect(this.getResponseHeader('Content-type')).to.equal('text/plain')
        expect(this.getResponseHeader('content-Type')).to.equal('text/plain')
        expect(this.getResponseHeader('content-type')).to.equal('text/plain')

        // Test aborted getAllResponseHeaders
        this.abort()
        expect(this.getAllResponseHeaders()).to.equal('')
        expect(this.getResponseHeader('Connection')).to.be.null()
      }
    }

    expect(xhr.getResponseHeader('Content-Type')).to.be.null()
    xhr.open('GET', `http://localhost:${port}/`)
    // Valid header
    xhr.setRequestHeader('X-Test', 'Foobar')
    xhr.setRequestHeader('X-Test2', 'Foobar1')
    xhr.setRequestHeader('X-Test2', 'Foobar2')
    // Invalid header
    xhr.setRequestHeader('Content-Length', 0)
    // Allowed header outside of specs
    xhr.setRequestHeader('user-agent', 'node-XMLHttpRequest-test')
    // Test getRequestHeader
    expect(xhr.getRequestHeader('X-Test')).to.equal('Foobar')
    expect(xhr.getRequestHeader('x-tEST')).to.equal('Foobar')
    expect(xhr.getRequestHeader('x-test2')).to.equal('Foobar1, Foobar2')
    // Test invalid header
    expect(xhr.getRequestHeader('Content-Length')).to.equal('')

    // Test allowing all headers
    xhr.setDisableHeaderCheck(true)
    xhr.setRequestHeader('Referer', 'http://github.com')
    expect(xhr.getRequestHeader('Referer'), 'http://github.com')

    xhr.send()

    await new Promise((resolve) => {
      server.on('close', () => {
        resolve()
      })
    })

    // Test setRequestHeader
    expect(requestHeaderXTest).to.equal('Foobar')
    // Test non-conforming allowed header
    expect(requestHeaderUserAgent).to.equal('node-XMLHttpRequest-test')
    // Test header set with blacklist disabled
    expect(requestHeaderReferer).to.equal('http://github.com')

  })
})
