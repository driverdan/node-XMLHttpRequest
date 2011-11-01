# node-XMLHttpRequest #

node-XMLHttpRequest is a wrapper for the built-in http client to emulate the browser XMLHttpRequest object.

This can be used with JS designed for browsers to improve reuse of code and allow the use of existing libraries.

## Usage ##
Here's how to include the module in your project and use as the browser-based XHR object.

	var XMLHttpRequest = require("XMLHttpRequest").XMLHttpRequest;
	var xhr = new XMLHttpRequest();

Refer to [W3C specs](http://www.w3.org/TR/XMLHttpRequest/) for XHR methods.

## Supports ##

* Async and synchronous requests
* GET, POST, and PUT requests
* All native methods (open, send, abort, getRequestHeader,
  getAllRequestHeaders)
* Requests to all domains

## TODO ##

* Add basic authentication
* Additional unit tests
* Possibly move from http to tcp for more flexibility
* DELETE requests aren't working
* XML parsing
