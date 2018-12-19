const assert = require('assert')
const http = require('http')
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest
let xhr

// Test server
http.createServer(function (req, res) {
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
  assert.strictEqual(onreadystatechange, true)
  assert.strictEqual(readystatechange, true)
  assert.strictEqual(removed, true)
  console.log('done')
  this.close()
}).listen(8000)

xhr = new XMLHttpRequest()

// Track event calls
let onreadystatechange = false
let readystatechange = false
let removed = true
const removedEvent = function () {
  removed = false
}

xhr.onreadystatechange = function () {
  onreadystatechange = true
}

xhr.addEventListener('readystatechange', function () {
  readystatechange = true
})

// This isn't perfect, won't guarantee it was added in the first place
xhr.addEventListener('readystatechange', removedEvent)
xhr.removeEventListener('readystatechange', removedEvent)

xhr.open('GET', 'http://localhost:8000')
xhr.send()
