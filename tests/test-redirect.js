const chai = require('chai')
const dirtyChai = require('dirty-chai')
chai.use(dirtyChai)
const expect = chai.expect
const http = require('http')
const getPort = require('get-port')
const XMLHttpRequest = require('../lib/XMLHttpRequest').XMLHttpRequest

let server

describe('XMLHttpRequest redirect', () => {
  beforeEach(async () => {
    const port = await getPort()
    server = http.createServer(function (req, res) {
      if (req.url === '/redirect307') {
        res.writeHead(307, { Location: `http://localhost:${port}/` })
        res.end()
        return
      }
      if (req.url === '/redirect303') {
        res.writeHead(303, { Location: `http://localhost:${port}/` })
        res.end()
        return
      }
      if (req.url === '/redirect302') {
        res.writeHead(302, { Location: `http://localhost:${port}/` })
        res.end()
        return
      }
      if (req.url === '/redirect301') {
        res.writeHead(301, { Location: `http://localhost:${port}/` })
        res.end()
        return
      }

      const body = 'Hello World'
      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(body),
        Date: 'Thu, 30 Aug 2012 18:17:53 GMT',
        Connection: 'close'
      })
      res.write('Hello World')
      res.end()
      this.close()
    }).listen(port)
  })

  it('should follow redirect 301', async () => {
    const port = server.address().port
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `http://localhost:${port}/redirect301`)
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        expect(xhr.status).to.equal(200)
        expect(xhr.getRequestHeader('Location')).to.equal('')
        expect(xhr.responseText).to.equal('Hello World')
      }
    }
    xhr.send()

    await new Promise((resolve) => {
      server.on('close', () => {
        resolve()
      })
    })
  })
  it('should follow redirect 302', async () => {
    const port = server.address().port
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `http://localhost:${port}/redirect302`)
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        expect(xhr.status).to.equal(200)
        expect(xhr.getRequestHeader('Location')).to.equal('')
        expect(xhr.responseText).to.equal('Hello World')
      }
    }
    xhr.send()

    await new Promise((resolve) => {
      server.on('close', () => {
        resolve()
      })
    })
  })
  it('should follow redirect 303', async () => {
    const port = server.address().port
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `http://localhost:${port}/redirect303`)
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        expect(xhr.status).to.equal(200)
        expect(xhr.getRequestHeader('Location')).to.equal('')
        expect(xhr.responseText).to.equal('Hello World')
      }
    }
    xhr.send()

    await new Promise((resolve) => {
      server.on('close', () => {
        resolve()
      })
    })
  })
  it('should follow redirect 307', async () => {
    const port = server.address().port
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `http://localhost:${port}/redirect307`)
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        expect(xhr.status).to.equal(200)
        expect(xhr.getRequestHeader('Location')).to.equal('')
        expect(xhr.responseText).to.equal('Hello World')
      }
    }
    xhr.send()

    await new Promise((resolve) => {
      server.on('close', () => {
        resolve()
      })
    })
  })
})
