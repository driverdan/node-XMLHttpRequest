const assert = require('assert')
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest
const xhr = new XMLHttpRequest()
const http = require('http')

// Test server
http.createServer(function (req, res) {
  // Test setRequestHeader
  assert.strictEqual('Foobar', req.headers['x-test'])
  // Test non-conforming allowed header
  assert.strictEqual('node-XMLHttpRequest-test', req.headers['user-agent'])
  // Test header set with blacklist disabled
  assert.strictEqual('http://github.com', req.headers['referer'])

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
}).listen(8000)

xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    // Test getAllResponseHeaders()
    var headers = 'content-type: text/plain\r\ncontent-length: 11\r\ndate: Thu, 30 Aug 2012 18:17:53 GMT\r\nconnection: close'
    assert.strictEqual(headers, this.getAllResponseHeaders())

    // Test case insensitivity
    assert.strictEqual('text/plain', this.getResponseHeader('Content-Type'))
    assert.strictEqual('text/plain', this.getResponseHeader('Content-type'))
    assert.strictEqual('text/plain', this.getResponseHeader('content-Type'))
    assert.strictEqual('text/plain', this.getResponseHeader('content-type'))

    // Test aborted getAllResponseHeaders
    this.abort()
    assert.strictEqual('', this.getAllResponseHeaders())
    assert.strictEqual(null, this.getResponseHeader('Connection'))

    console.log('done')
  }
}

assert.strictEqual(null, xhr.getResponseHeader('Content-Type'))
try {
  xhr.open('GET', 'http://localhost:8000/')
  // Valid header
  xhr.setRequestHeader('X-Test', 'Foobar')
  xhr.setRequestHeader('X-Test2', 'Foobar1')
  xhr.setRequestHeader('X-Test2', 'Foobar2')
  // Invalid header
  xhr.setRequestHeader('Content-Length', 0)
  // Allowed header outside of specs
  xhr.setRequestHeader('user-agent', 'node-XMLHttpRequest-test')
  // Test getRequestHeader
  assert.strictEqual('Foobar', xhr.getRequestHeader('X-Test'))
  assert.strictEqual('Foobar', xhr.getRequestHeader('x-tEST'))
  assert.strictEqual('Foobar1, Foobar2', xhr.getRequestHeader('x-test2'))
  // Test invalid header
  assert.strictEqual('', xhr.getRequestHeader('Content-Length'))

  // Test allowing all headers
  xhr.setDisableHeaderCheck(true)
  xhr.setRequestHeader('Referer', 'http://github.com')
  assert.strictEqual('http://github.com', xhr.getRequestHeader('Referer'))

  xhr.send()
} catch (e) {
  console.log('ERROR: Exception raised', e)
}
