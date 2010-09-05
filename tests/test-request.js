var sys = require("sys")
	,assert = require("assert")
	,XMLHttpRequest = require("../XMLHttpRequest").XMLHttpRequest
	,http = require("http")
	,xhr;

// Test server
var server = http.createServer(function (req, res) {
	assert.equal(methods[curMethod], req.method);
	
	//url = require("url").parse(req.uri);
	assert.equal("/" + methods[curMethod], req.url);
	
	var body = "Hello World";
	
	res.writeHead(200, {
		"Content-Type": "text/plain",
		"Content-Length": body.length
	});
	res.write("Hello World");
	res.end();
	
	if (curMethod == methods.length - 1) {
		this.close();
		sys.puts("done");
	}
}).listen(8000);

// Test standard methods
var methods = ["GET", "POST", "HEAD", "PUT", "DELETE"];
var curMethod = 0;

function start(method) {
	// Reset each time
	xhr = new XMLHttpRequest();
	
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			assert.equal("Hello World", this.responseText);
			curMethod++;
		
			if (curMethod < methods.length) {
				start(methods[curMethod]);
			}
		}
	};
	
	xhr.open(method, "http://localhost:8000/" + method);
	xhr.send();
}

start(methods[curMethod]);