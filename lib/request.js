const http = require('http')
const https = require('https')

function doRequest (options, data) {
  const { ssl, encoding, requestOptions } = options
  if (data && requestOptions.headers) {
    requestOptions.headers['Content-Length'] = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data)
  }
  return new Promise((resolve, reject) => {
    let responseText = ''
    const responseBinary = []
    const httpRequest = ssl ? https.request : http.request
    const req = httpRequest(requestOptions, function (response) {
      if (encoding !== 'binary') {
        response.setEncoding(encoding)
      }
      response.on('data', function (chunk) {
        if (encoding === 'binary') {
          responseBinary.push(chunk)
        } else {
          responseText += chunk
        }
      })
      response.on('end', function () {
        const result = {
          error: null,
          data: { statusCode: response.statusCode, headers: response.headers }
        }
        if (encoding === 'binary') {
          result.data.binary = Buffer.concat(responseBinary)
        } else {
          result.data.text = responseText
        }
        resolve(result)
      })
      response.on('error', function (error) {
        reject(error)
      })
    }).on('error', function (error) {
      reject(error)
    })
    if (data) {
      req.write(data)
    }
    req.end()
  })
}

(async () => {
  try {
    const encoding = 'utf-8'
    let data
    const args = process.argv.slice(2)
    const options = {}
    for (let j = 0; j < args.length; j++) {
      const arg = args[j]
      if (arg.startsWith('--ssl=')) {
        options.ssl = arg.slice('--ssl='.length) === 'true'
      } else if (arg.startsWith('--encoding=')) {
        options.encoding = arg.slice('--encoding='.length)
      } else if (arg.startsWith('--request-options=')) {
        options.requestOptions = JSON.parse(arg.slice('--request-options='.length))
      }
    }
    if (process.stdin.isTTY) {
      // Even though executed by name, the first argument is still "node",
      // the second the script name. The third is the string we want.
      data = Buffer.from(process.argv[2] || '', encoding)
      const result = await doRequest(options, data)
      console.log(JSON.stringify(result))
    } else {
      // Accepting piped content. E.g.:
      // echo "pass in this string as input" | ./example-script
      data = ''
      process.stdin.setEncoding(encoding)
      process.stdin.on('readable', function () {
        let chunk = process.stdin.read()
        while (chunk) {
          data += chunk
          chunk = process.stdin.read()
        }
      })
      process.stdin.on('end', async function () {
        // There will be a trailing \n from the user hitting enter. Get rid of it.
        data = data.replace(/\n$/, '')
        const result = await doRequest(options, data)
        console.log(JSON.stringify(result))
      })
    }
  } catch (e) {
    console.log(JSON.stringify({ error: e }))
  }
})()
