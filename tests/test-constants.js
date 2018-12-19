const chai = require('chai')
const expect = chai.expect

const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest
const xhr = new XMLHttpRequest()

describe('XMLHttpRequest constants', () => {
  it('should return the value defined in the specification', () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
    expect(xhr.UNSENT).to.equal(0)
    expect(xhr.OPENED).to.equal(1)
    expect(xhr.HEADERS_RECEIVED).to.equal(2)
    expect(xhr.LOADING).to.equal(3)
    expect(xhr.DONE).to.equal(4)
  })
})
