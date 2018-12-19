const http = require('http')
const https = require('https')

function doRequest () {
  return function (args) {
    const { ssl, encoding, options } = args
    return new Promise((resolve, reject) => {
      let responseText = ''
      const httpRequest = ssl ? https.request : http.request
      const req = httpRequest(options, function (response) {
        response.setEncoding(encoding)
        response.on('data', function (chunk) { responseText += chunk })
        response.on('end', function () {
          resolve({
            error: null,
            data: { statusCode: response.statusCode, headers: response.headers, text: responseText }
          })
        })
        response.on('error', function (error) {
          reject(error)
        })
      }).on('error', function (error) {
        reject(error)
      })
      req.end()
    })
  }
}

module.exports = doRequest
