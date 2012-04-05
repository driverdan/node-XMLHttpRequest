var sys = require("util")
  ,assert = require("assert")
  ,XMLHttpRequest = require("../lib/XMLHttpRequest").XMLHttpRequest
  ,xhr = new XMLHttpRequest()
  ,http = require("http");

// Test server
var server = http.createServer(function (req, res) {
  var body = "Hello World";
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Content-Length": Buffer.byteLength(body),
    "Connection": "close"
  });
  res.write("Hello World");
  res.end();

  this.close();
}).listen(8000);

// Test request methods that aren't allowed
try {
  xhr.open("TRACK", "http://localhost:8000/");
} catch(e) {
  console.log("Exception for TRACK", e);
}
try {
  xhr.open("TRACE", "http://localhost:8000/");
} catch(e) {
  console.log("Exception for TRACE", e);
}
try {
  xhr.open("CONNECT", "http://localhost:8000/");
} catch(e) {
  console.log("Exception for CONNECT", e);
}
// Test valid request method
try {
  xhr.open("GET", "http://localhost:8000/");
  console.log("GET request allowed");
} catch(e) {
  console.log("Invalid exception for GET", e);
}
