var Url = require("url");

/**
 * Wrapper for built-in http.js to emulate the browser XMLHttpRequest object.
 *
 * This can be used with JS designed for browsers to improve reuse of code and
 * allow the use of existing libraries.
 *
 * Usage: include("XMLHttpRequest.js") and use XMLHttpRequest per W3C specs.
 *
 * @todo SSL Support
 * @author Dan DeFelippi <dan@driverdan.com>
 * @license MIT
 */

exports.XMLHttpRequest = function() {
	/**
	 * Private variables
	 */
	var self = this;
	var http = require('http');

	// Holds http.js objects
	var client;
	var request;
	var response;
	
	// Request settings
	var settings = {};
	
	// Set some default headers
	var defaultHeaders = {
		"User-Agent": "node.js",
		"Accept": "*/*",
	};
	
	var headers = defaultHeaders;
	
	/**
	 * Constants
	 */
	this.UNSENT = 0;
	this.OPENED = 1;
	this.HEADERS_RECEIVED = 2;
	this.LOADING = 3;
	this.DONE = 4;

	/**
	 * Public vars
	 */
	// Current state
	this.readyState = this.UNSENT;

	// default ready state change handler in case one is not set or is set late
	this.onreadystatechange = function() {};

	// Result & response
	this.responseText = "";
	this.responseXML = "";
	this.status = null;
	this.statusText = null;
		
	/**
	 * Open the connection. Currently supports local server requests.
	 *
	 * @param string method Connection method (eg GET, POST)
	 * @param string url URL for the connection.
	 * @param boolean async Asynchronous connection. Default is true.
	 * @param string user Username for basic authentication (optional)
	 * @param string password Password for basic authentication (optional)
	 */
	this.open = function(method, url, async, user, password) {
		settings = {
			"method": method,
			"url": url,
			"async": async,
			"user": user,
			"password": password
		};
		
		this.abort();

		setState(this.OPENED);
	};
	
	/**
	 * Sets a header for the request.
	 *
	 * @param string header Header name
	 * @param string value Header value
	 */
	this.setRequestHeader = function(header, value) {
		headers[header] = value;
	};
	
	/**
	 * Gets a header from the server response.
	 *
	 * @param string header Name of header to get.
	 * @return string Text of the header or null if it doesn't exist.
	 */
	this.getResponseHeader = function(header) {
		if (this.readyState > this.OPENED && response.headers[header]) {
			return header + ": " + response.headers[header];
		}
		
		return null;
	};
	
	/**
	 * Gets all the response headers.
	 *
	 * @return string 
	 */
	this.getAllResponseHeaders = function() {
		if (this.readyState < this.HEADERS_RECEIVED) {
			throw "INVALID_STATE_ERR: Headers have not been received.";
		}
		var result = "";
		
		for (var i in response.headers) {
			result += i + ": " + response.headers[i] + "\r\n";
		}
		return result.substr(0, result.length - 2);
	};

	/**
	 * Sends the request to the server.
	 *
	 * @param string data Optional data to send as request body.
	 */
	this.send = function(data) {
		if (this.readyState != this.OPENED) {
			throw "INVALID_STATE_ERR: connection must be opened before send() is called";
		}
		
		var url = Url.parse(settings.url)

		// Determine the server
		switch (url.protocol) {
			case 'http:':
				var host = url.hostname;
				break;
			
			case undefined:
			case '':
				var host = "localhost";
				break;
			
			case 'https:':
				throw "SSL is not implemented.";
				break;
			
			default:
				throw "Protocol not supported.";
		}

		// Default to port 80. If accessing localhost on another port be sure
		// to use http://localhost:port/path
		var port = url.port || 80;
		var uri = url.pathname + url.search;
		
		// Set the Host header or the server may reject the request
		headers["Host"] = host;
		
		client = http.createClient(port, host);
		
		client.addListener('error', function (error) {  //Error checking
			self.status=503;
			self.statusText=error;
			self.responseText=error.stack;
			setState(self.DONE);
			//throw error;
		})

		// Set content length header
		if (settings.method == "GET" || settings.method == "HEAD") {
			data = null;
		} else if (data) {
			headers["Content-Length"] = data.length;
			
			if (!headers["Content-Type"]) {
				headers["Content-Type"] = "text/plain;charset=UTF-8";
			}
		}
		
		// Use the correct request method
        request = client.request(settings.method, uri, headers);

		// Send data to the server
		if (data) {
			request.write(data);
		}
		
		request.addListener('response', function(resp) {
			response = resp;
			response.setEncoding("utf8");
			
			setState(self.HEADERS_RECEIVED);

			self.status = response.statusCode;
			
			response.addListener("data", function(chunk) {
				// Make sure there's some data
				if (chunk) {
					self.responseText += chunk;
				}
				setState(self.LOADING);
			});
	
			response.addListener("end", function() {
				setState(self.DONE);
			});
		});		
		request.end();
	};

	/**
	 * Aborts a request.
	 */
	this.abort = function() {
		headers = defaultHeaders;
		this.readyState = this.UNSENT;
		this.responseText = "";
		this.responseXML = "";
	};
	
	/**
	 * Changes readyState and calls onreadystatechange.
	 *
	 * @param int state New state
	 */
	var setState = function(state) {
		self.readyState = state;
		self.onreadystatechange();
	}
};
