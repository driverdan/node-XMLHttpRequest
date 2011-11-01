var sys = require("util")
  ,assert = require("assert")
  ,XMLHttpRequest = require("../XMLHttpRequest").XMLHttpRequest
  ,xhr = new XMLHttpRequest()
  ,http = require("http");

// Test server
var server = http.createServer(function (req, res) {
  // Test setRequestHeader
  assert.equal("Foobar", req.headers["x-test"]);

  var body = "Hello World";
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Content-Length": Buffer.byteLength(body)
  });
  res.write("Hello World");
  res.end();

  this.close();
}).listen(8000);

xhr.onreadystatechange = function() {
  if (this.readyState == 4) {
    // Test getAllResponseHeaders()
    var headers = "content-type: text/plain\r\ncontent-length: 11\r\nconnection: close";
    assert.equal(headers, this.getAllResponseHeaders());

    // Test aborted getAllResponseHeaders
    this.abort();
    assert.equal("", this.getAllResponseHeaders());
    assert.equal(null, this.getResponseHeader("Connection"));

    sys.puts("done");
  }
};

assert.equal(null, xhr.getResponseHeader("Content-Type"));
xhr.open("GET", "http://localhost:8000/");
xhr.setRequestHeader("X-Test", "Foobar");
xhr.send();
