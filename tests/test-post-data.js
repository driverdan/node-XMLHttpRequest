var sys = require("util")
  , assert = require("assert")
  , XMLHttpRequest = require("../lib/XMLHttpRequest").XMLHttpRequest
  , http = require("http")
  , FormData = require("form-data")
  , formidable = require("formidable")
  , xhr;

// Test server
var method = "POST";
var server = http.createServer(function (req, res) {
  // Check request method and URL
  assert.equal(method, req.method);
  assert.equal("/" + method, req.url);

  var form = formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    assert.equal(err, null);
    assert.equal(fields.key, "value");
    var body = "Hello World";

    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Content-Length": Buffer.byteLength(body)
    });
    res.write(body);
    res.end();
    server.close();
  });
}).listen(8000);

// Test POST with FormData
var form = new FormData();
form.append("key", "value");

function start() {
  // Reset each time
  xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      assert.equal("Hello World", this.responseText);
      sys.puts("done");
    }
  };

  var url = "http://localhost:8000/" + method;
  xhr.open(method, url);
  xhr.send(form);
}

sys.puts("Testing POST with FormData");
start();
