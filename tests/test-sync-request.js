const childProcess = require('child_process')
const fs = require('fs')
const chai = require('chai')
const dirtyChai = require('dirty-chai')
chai.use(dirtyChai)
const expect = chai.expect
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest

describe('XMLHttpRequest sync request', () => {
  it('should get resource synchronously', async () => {
    const child = childProcess.fork(`${__dirname}/server.js`)
    try {
      let data = ''
      await new Promise((resolve) => {
        child.on('message', message => {
          if (message && message.port) {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', `http://localhost:${message.port}`, false)
            xhr.onload = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  data = xhr.responseText
                }
              }
            }
            xhr.send()
            resolve()
          }
        })
      })
      expect(data).to.equal('Hello World')
    } finally {
      child.kill()
    }
  })
  it('should get image synchronously', async () => {
    const child = childProcess.fork(`${__dirname}/server.js`)
    try {
      let arrayBuffer = ''
      await new Promise((resolve) => {
        child.on('message', message => {
          if (message && message.port) {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', `http://localhost:${message.port}/cat.png`, false)
            xhr.responseType = 'arraybuffer'
            xhr.onload = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  arrayBuffer = new Uint8Array(xhr.response)
                }
              }
            }
            xhr.send()

            resolve()
          }
        })
      })
      expect(fs.readFileSync(`${__dirname}/cat.png`).compare(arrayBuffer)).to.equal(0)
    } finally {
      child.kill()
    }
  })
  it('should post data synchronously', async () => {
    const child = childProcess.fork(`${__dirname}/server.js`)
    try {
      let responseText = ''
      await new Promise((resolve) => {
        child.on('message', message => {
          if (message && message.port) {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', `http://localhost:${message.port}/echo`, false)
            xhr.onload = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  responseText = xhr.responseText
                }
              }
            }
            xhr.send('ping! "from client"')
            resolve()
          }
        })
      })
      expect(responseText).to.equal('ping! "from client"')
    } finally {
      child.kill()
    }
  })
})


