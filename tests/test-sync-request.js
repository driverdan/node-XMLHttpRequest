const childProcess = require('child_process')
const chai = require('chai')
const dirtyChai = require('dirty-chai')
chai.use(dirtyChai)
const expect = chai.expect
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest

describe('XMLHttpRequest sync request', () => {
  it('should get resource synchronously', async () => {
    const child = childProcess.fork(`${__dirname}/server.js`)
    await new Promise((resolve) => {
      child.on('message', message => {
        if (message && message.port) {
          const xhr = new XMLHttpRequest()
          xhr.open('GET', `http://localhost:${message.port}`, false)
          let data = ''
          xhr.onload = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                data = xhr.responseText
              }
            }
          };
          xhr.send()
          expect(data).to.equal('Hello World')
          resolve()
        }
      });
    })
  })
})


