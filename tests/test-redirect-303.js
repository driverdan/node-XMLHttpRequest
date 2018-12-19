const assert = require('assert')
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest
const xhr = new XMLHttpRequest()
const http = require('http')

// Test server
http.createServer(function (req, res) {
  if (req.url === '/redirectingResource') {
    res.writeHead(303, { 'Location': 'http://localhost:8000/' })
    res.end()
    return
  }

  const body = 'Hello World'
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(body),
    'Date': 'Thu, 30 Aug 2012 18:17:53 GMT',
    'Connection': 'close'
  })
  res.write('Hello World')
  res.end()

  this.close()
}).listen(8000)

xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    assert.strictEqual(xhr.getRequestHeader('Location'), '')
    assert.strictEqual(xhr.responseText, 'Hello World')
    console.log('done')
  }
}

try {
  xhr.open('POST', 'http://localhost:8000/redirectingResource')
  xhr.send()
} catch (e) {
  console.log('ERROR: Exception raised', e)
}
