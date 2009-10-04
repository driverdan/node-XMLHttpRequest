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
	var http = require('/http.js');

	// Holds http.js objects
	var client;
	var request;
	var response;
	
	// Request settings
	var settings = {};
	
	// Set some default headers
	var headers = {
		"User-Agent": "node.js",
		"Accept": "*/*",
	};
	
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

	// Result & response
	this.responseText = null;
	this.responseXML = null;
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
	};
	
	/**
	 * Sets a header for the request.
	 *
	 * @param string header Header name
	 * @param string value Header value
	 */
	this.setRequestHeader = function(header, value) {
		headers.header = value;
	};
	
	/**
	 * Gets a header from the server response.
	 *
	 * @param string header Name of header to get.
	 * @return string Text of the header or null if it doesn't exist.
	 */
	this.getResponseHeader = function(header) {
		if (this.readyState > this.OPENED && response.headers.header) {
			return header + ": " + response.headers.header;
		}
		
		return null;
	};
	
	/**
	 * Gets all the response headers.
	 *
	 * @return string 
	 */
	this.getAllResponseHeaders = function() {
		return null;
	};

	/**
	 * Sends the request to the server.
	 *
	 * @param string data Optional data to send as request body.
	 */
	this.send = function(data) {
		var self = this;
		
		/**
		 * Figure out if a host and/or port were specified.
		 * Regex borrowed from parseUri and modified. Needs additional optimization.
		 * @see http://blog.stevenlevithan.com/archives/parseuri
		 */
		var loc = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?([^?#]*)/.exec(settings.url);
		
		// Determine the server
		switch (loc[1]) {
			case 'http':
				var host = loc[6];
				break;
			
			case undefined:
			case '':
				var host = "localhost";
				break;
			
			case 'https':
				throw "SSL is not implemented.";
				break;
			
			default:
				throw "Protocol not supported.";
		}
		
		// Default to port 80. If accessing localhost on another port be sure to
		// use http://localhost:port/path
		var port = loc[7] ? loc[7] : 80;
		
		// Set the URI, default to /
		var uri = loc[8] ? loc[8] : "/";
		
		// Set the Host header or the server may reject the request
		headers["Host"] = host;
		
		client = http.createClient(port, host);

		this.readyState = this.OPENED;
		this.onreadystatechange();

		// Set content length header
		if (data) {
			headers["Content-Length"] = data.length;
		}
		
		// Use the correct request method
		switch (settings.method) {
			case 'GET':
				request = client.get(uri, headers);
				break;
			
			case 'POST':
				request = client.get(uri, headers);
				break;
	
			case 'HEAD':
				request = client.head(uri, headers);
				break;
	
			case 'PUT':
				request = client.put(uri, headers);
				break;
	
			case 'DELETE':
				request = client.del(uri, headers);
				break;
	
			default:
				throw "Request method is unsupported.";
		}

		this.readyState = this.HEADERS_RECEIVED;
		this.onreadystatechange();

		// Send data to the server
		if (data) {
			request.sendBody(data);
		}

		request.finish(function(resp) {
			response = resp;
			response.setBodyEncoding("utf8");
	
			self.status = response.statusCode;
			
			response.addListener("body", function(chunk) {
				// Make sure there's some data
				if (chunk) {
					self.responseText += chunk;
				}
				self.readyState = self.LOADING;
				self.onreadystatechange();
			});
	
			response.addListener("complete", function() {
				self.readyState = self.DONE;
				self.onreadystatechange();
			});
		});
	};

	/**
	 * Aborts a request.
	 */
	this.abort = function() {
		
	};
};
