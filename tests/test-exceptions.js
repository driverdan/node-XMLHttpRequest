const chai = require('chai')
const dirtyChai = require('dirty-chai')
chai.use(dirtyChai)
const expect = chai.expect
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest
const xhr = new XMLHttpRequest()

describe('XMLHttpRequest exceptions', () => {
  it('should throw an exception if method TRACK is used', () => {
    expect(() => xhr.open('TRACK', 'http://localhost:8000/')).to.throw('SecurityError: Request method not allowed')
  })
  it('should throw an exception if method TRACE is used', () => {
    expect(() => xhr.open('TRACE', 'http://localhost:8000/')).to.throw('SecurityError: Request method not allowed')
  })
  it('should throw an exception if method CONNECT is used', () => {
    expect(() => xhr.open('CONNECT', 'http://localhost:8000/')).to.throw('SecurityError: Request method not allowed')
  })
  it('should not throw an exception if method GET is used', () => {
    expect(() => xhr.open('GET', 'http://localhost:8000/')).to.not.throw()
  })
  it('should not add forbidden request headers', () => {
    // Test forbidden headers
    const forbiddenRequestHeaders = [
      'accept-charset',
      'accept-encoding',
      'access-control-request-headers',
      'access-control-request-method',
      'connection',
      'content-length',
      'content-transfer-encoding',
      'cookie',
      'cookie2',
      'date',
      'expect',
      'host',
      'keep-alive',
      'origin',
      'referer',
      'te',
      'trailer',
      'transfer-encoding',
      'upgrade',
      'via'
    ]
    for (const i in forbiddenRequestHeaders) {
      const headerKey = forbiddenRequestHeaders[i]
      xhr.setRequestHeader(headerKey, 'Test')
      // should ignore forbidden request headers and log a warning
      expect(xhr.getRequestHeader(headerKey)).to.equal('')
    }
  })
  it('should add a valid request header', () => {
    xhr.setRequestHeader('X-Foobar', 'Test')
    expect(xhr.getRequestHeader('X-Foobar')).to.equal('Test')
  })
})

/*
// Test forbidden headers
const forbiddenRequestHeaders = [
  'accept-charset',
  'accept-encoding',
  'access-control-request-headers',
  'access-control-request-method',
  'connection',
  'content-length',
  'content-transfer-encoding',
  'cookie',
  'cookie2',
  'date',
  'expect',
  'host',
  'keep-alive',
  'origin',
  'referer',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'user-agent',
  'via'
]

for (let i in forbiddenRequestHeaders) {
  try {
    const headerKey = forbiddenRequestHeaders[i]
    xhr.setRequestHeader(headerKey, 'Test')
    // should ignore forbidden request headers and log a warning
    assert.strictEqual(xhr.headers[headerKey], undefined)
  } catch (e) {
  }
}

// Try valid header
xhr.setRequestHeader('X-Foobar', 'Test')

console.log('Done')
*/
