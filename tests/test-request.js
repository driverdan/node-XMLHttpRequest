include("common.js");
include("/http.js");

var xhr;

// Test server
var server = createServer(function (req, res) {
	assertEquals(methods[curMethod], req.method);
	assertEquals("/" + methods[curMethod], req.uri.path);
	res.sendHeader(200, {"Content-Type": "text/plain"});
	res.sendBody("Hello World");
	res.finish();
	
	if (curMethod == methods.length - 1) {
		this.close();
		puts("done");
	}
}).listen(8000);

// Test all supported methods
var methods = ["GET", "POST", "HEAD", "PUT", "DELETE"];
var curMethod = 0;

function start(method) {
	p("Testing " + method);
	
	// Reset each time
	xhr = new XMLHttpRequest();
	
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			assertEquals("Hello World", this.responseText);
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
