const assert = require('assert')
const http = require('http')
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest
let xhr

// Test server

function completeResponse (res, server, body) {
  res.end()
  assert.strictEqual(onreadystatechange, true)
  assert.strictEqual(readystatechange, true)
  assert.strictEqual(removed, true)
  assert.strictEqual(loadCount, body.length)
  console.log('done')
  server.close()
}

http.createServer(function (req, res) {
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
}).listen(8000)

xhr = new XMLHttpRequest()

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

xhr.open('GET', 'http://localhost:8000')
xhr.send()
