require("./common");
var http = require("http");

var xhr;

// Test server
var server = http.createServer(function (req, res) {
	// Test setRequestHeader
	assertEquals("Foobar", req.headers["X-Test"]);
	
	var body = "Hello World";
	res.sendHeader(200, {
		"Content-Type": "text/plain",
		"Content-Length": body.length
	});
	res.sendBody("Hello World");
	res.finish();
	
	this.close();
}).listen(8000);

xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
	if (this.readyState == 4) {
		// Test getAllResponseHeaders()
		var headers = "Content-Type: text/plain\r\nContent-Length: 11\r\nConnection: close";
		assertEquals(headers, this.getAllResponseHeaders());
		
		puts("done");
	}
};

xhr.open("GET", "http://localhost:8000/");
xhr.setRequestHeader("X-Test", "Foobar");
xhr.send();
