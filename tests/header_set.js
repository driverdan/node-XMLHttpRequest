var sys = require('util');
var XMLHttpRequest = require("./lib/xmlhttprequest").XMLHttpRequest;

var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
	sys.puts("State: " + this.readyState);
	
	if (this.readyState == 4) {
		sys.puts("Complete.\nBody length: " + this.responseText.length);
		sys.puts("Body:\n" + this.responseText);
	}
};

xhr.open("GET", "http://localhost/ua_test.php");

xhr.disableHeaderCheck(true)//Disable check

xhr.setRequestHeader('User-Agent', 'Search bot'); //set forbidden header
xhr.send();