const assert = require('assert')

const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest

const xhr = new XMLHttpRequest()

// Test constant values
assert.strictEqual(0, xhr.UNSENT)
assert.strictEqual(1, xhr.OPENED)
assert.strictEqual(2, xhr.HEADERS_RECEIVED)
assert.strictEqual(3, xhr.LOADING)
assert.strictEqual(4, xhr.DONE)

console.log('done')
