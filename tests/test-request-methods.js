const assert = require('assert')
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest
const http = require('http')
let xhr

// Test server
http.createServer(function (req, res) {
  // Check request method and URL
  assert.strictEqual(methods[curMethod], req.method)
  assert.strictEqual('/' + methods[curMethod], req.url)

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

  if (curMethod === methods.length - 1) {
    this.close()
    console.log('done')
  }
}).listen(8000)

// Test standard methods
const methods = ['GET', 'POST', 'HEAD', 'PUT', 'DELETE']
let curMethod = 0

function start (method) {
  // Reset each time
  xhr = new XMLHttpRequest()

  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (method === 'HEAD') {
        assert.strictEqual('', this.responseText)
      } else {
        assert.strictEqual('Hello World', this.responseText)
      }

      curMethod++

      if (curMethod < methods.length) {
        console.log('Testing ' + methods[curMethod])
        start(methods[curMethod])
      }
    }
  }

  var url = 'http://localhost:8000/' + method
  xhr.open(method, url)
  xhr.send()
}

console.log('Testing ' + methods[curMethod])
start(methods[curMethod])
