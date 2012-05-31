var sys = require("util")
  , assert = require("assert")
  , XMLHttpRequest = require("../lib/XMLHttpRequest").XMLHttpRequest
  , xhr;

xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
  if (this.readyState == 4) {
    assert.equal("Hello World", this.responseText);
    this.close();
  }
};

var url = "file://" + __dirname + "/testdata.txt";
xhr.open("GET", url);
xhr.send();
