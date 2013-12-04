/**
 * This code is only being used when compiled with tools, such as for example
 * browserify, that respects the "browser"-field in package.json.
 */

/**
 * The native XMLHttpRequest of the browser, if available. When in case this
 * file is parsed this will replace the one from ./XMLHttpRequest.js.
 *
 * @type {XMLHttpRequest|null}
 */
exports.XMLHttpRequest =  window.XMLHttpRequest || null;

