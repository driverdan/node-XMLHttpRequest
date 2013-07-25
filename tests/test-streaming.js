var sys = require("util")
  , assert = require("assert")
  , http = require("http")
  , XMLHttpRequest = require("../lib/XMLHttpRequest").XMLHttpRequest
  , xhr;

// Test server

function completeResponse(res,server,body) {
  res.end();
  assert.equal(onreadystatechange, true);
  assert.equal(readystatechange, true);
  assert.equal(removed, true);
  assert.equal(loadCount, body.length);
  sys.puts("done");
  server.close();
}
function push(res,piece) {
  res.write(piece);
}

var server = http.createServer(function (req, res) {
  var body = (req.method != "HEAD" ? ["Hello","World","Stream"] : []);

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Content-Length": Buffer.byteLength(body.join(""))
  });
  
  var nextPiece = 0;
  var self = this;
  var interval = setInterval(function() {
    if (nextPiece < body.length) {
      res.write(body[nextPiece]);
      nextPiece++;
    } else {
      completeResponse(res,self,body);
      clearInterval(interval);
    }
  },100); //nagle may put writes together, if it happens rise the interval time

}).listen(8000);

xhr = new XMLHttpRequest();

// Track event calls
var onreadystatechange = false;
var readystatechange = false;
var removed = true;
var loadCount = 0;
var removedEvent = function() {
  removed = false;
};

xhr.onreadystatechange = function() {
  onreadystatechange = true;
};

xhr.addEventListener("readystatechange", function() {
  readystatechange = true;
  if (xhr.readyState == xhr.LOADING) {
    loadCount++;
  }
});

// This isn't perfect, won't guarantee it was added in the first place
xhr.addEventListener("readystatechange", removedEvent);
xhr.removeEventListener("readystatechange", removedEvent);

xhr.open("GET", "http://localhost:8000");
xhr.send();
