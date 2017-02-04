var sys = require("util")
  , assert = require("assert")
  , XMLHttpRequest = require("../lib/XMLHttpRequest").XMLHttpRequest
  , https = require("https")
  , fs = require('fs')
  , xhr;

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

// Test server
var server = https.createServer(options, function (req, res) {
  // Check request method and URL
  assert.equal(methods[curMethod], req.method);
  assert.equal("/" + methods[curMethod], req.url);

  var body = (req.method != "HEAD" ? "Hello World" : "");

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Content-Length": Buffer.byteLength(body)
  });
  // HEAD has no body
  if (req.method != "HEAD") {
    res.write(body);
  }
  res.end();
}).listen(8000);

// Test standard methods
var methods = ["GET", "POST", "HEAD", "PUT", "DELETE"];
var curMethod = 0;

function start(method) {
  // Reset each time
  xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      assert.equal(this.responseText.indexOf("Error: self") > -1, true);

      curMethod++;

      if (curMethod < methods.length) {
        console.log("Testing " + methods[curMethod]);
        start(methods[curMethod]);
      } else {
        server.close();
        console.log('done');
      }
    }
  };

  var url = "https://localhost:8000/" + method;
  xhr.open(method, url);
  xhr.send();
}

console.log("Testing " + methods[curMethod]);
start(methods[curMethod]);
