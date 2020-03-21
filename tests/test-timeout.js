var sys = require("util")
  , assert = require("assert")
  , http = require('http')
  , XMLHttpRequest = require("../lib/XMLHttpRequest").XMLHttpRequest;

// Test server
http.createServer(function (req, res) {
  setTimeout(() => {
    res.end();
    this.close();
  }, 3000);
}).listen(8000);

var xhr = new XMLHttpRequest();
// Testing simple timeout case
xhr.open("GET", "http://localhost:8000/nowhere");
xhr.timeout = 1000;

xhr.ontimeout = function () {
  console.log('Request timed out!');
}

xhr.send(null);

// Testing when timeout is set on a sync request
// Should throw an Error
xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:8000/nowhere", false);

try {
  xhr.timeout = 1000;
} catch (e) {
  console.log(e.message);
  assert.equal(e.message, 'InvalidAccessError: synchronous XMLHttpRequests do not support timeout and responseType.');
}

// Should also throw an Error if the timeout is set
// before xhr.open() on a sync request
xhr = new XMLHttpRequest();
xhr.timeout = 1000;

try {
  xhr.open("GET", "http://localhost:8000/nowhere", false);
} catch (e) {
  console.log(e.message);
  assert.equal(e.message, 'InvalidAccessError: synchronous XMLHttpRequests do not support timeout and responseType.');
}
