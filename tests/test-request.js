var sys = require("util")
	,assert = require("assert")
	,XMLHttpRequest = require("../XMLHttpRequest").XMLHttpRequest
	,http = require("http")
	,xhr;

// Test standard methods
var methods = ["GET", "POST", "HEAD", "PUT", "DELETE"], curMethod;

// Test server
var server = http.createServer(function (req, res) {
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
	
	if (curMethod == methods.length - 1) {
		this.close();
		sys.puts("done");
	}
}).listen(8000, function(){

function start(method) {
	sys.puts("Testing " + method);
	// Reset each time
	xhr = new XMLHttpRequest();
	
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (method == "HEAD") {
				assert.equal("", this.responseText);
			} else {
				assert.equal("Hello World", this.responseText);
			}
			
			curMethod++;
		
			if (curMethod < methods.length) {
				start(methods[curMethod]);
			}
		}
	};
	
	var url = "http://localhost:8000/" + method;
	xhr.open(method, url, true);
	xhr.send();
}

curMethod=0
start(methods[curMethod]);
});
