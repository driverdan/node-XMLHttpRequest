> XMLHttpRequest Level 2 for Node.js

[![Build Status: Linux](https://travis-ci.org/Mogztter/node-XMLHttpRequest.svg?branch=master)](https://travis-ci.org/Mogztter/node-XMLHttpRequest)

XMLHttpRequest is a wrapper of the built-in `http` client to emulate the browser `XMLHttpRequest` object.

**Important:** This library is a fork of [https://github.com/driverdan/node-XMLHttpRequest](https://github.com/driverdan/node-XMLHttpRequest).
It was created to be compliant with [XMLHttpRequest Level 2](http://www.w3.org/TR/XMLHttpRequest2/).

## Highlights

- Dependency free
- Asynchronous and synchronous requests
- `GET`, `POST`, `PUT`, and `DELETE` requests
- Binary data using JavaScript typed arrays
- Follows redirects
- Handles `file://` protocol

## Usage

Here's how to include the module in your project and use as the browser-based XHR object.

```js
const XMLHttpRequest = require('xmlhttprequest2').XMLHttpRequest
const xhr = new XMLHttpRequest()
```

Note: use the lowercase string `'xmlhttprequest2'` in your require().
On case-sensitive systems (eg. Linux) using uppercase letters won't work.

## Known Issues / Missing Features

For a list of open issues or to report your own visit the [github issues page](https://github.com/Mogztter/node-XMLHttpRequest/issues).

* Local file access may have unexpected results for non-UTF8 files
* Synchronous requests don't set headers properly
* Synchronous requests freeze node while waiting for response (But that's what you want, right? Stick with async!).
* Some events are missing, such as abort
* Cookies aren't persisted between requests
* Missing XML support

## License

MIT license. See LICENSE for full details.
