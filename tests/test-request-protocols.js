const assert = require('assert')
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest
let xhr

xhr = new XMLHttpRequest()

xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    assert.strictEqual('Hello World', this.responseText)
    runSync()
  }
}

// Async
const url = `file://${__dirname}/testdata.txt`
xhr.open('GET', url)
xhr.send()

// Sync
const runSync = function () {
  xhr = new XMLHttpRequest()

  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      assert.strictEqual('Hello World', this.responseText)
      console.log('done')
    }
  }
  xhr.open('GET', url, false)
  xhr.send()
}
