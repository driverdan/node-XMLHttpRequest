include("/utils.js");
include("XMLHttpRequest.js");

var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
	puts("State: " + this.readyState);
	
	if (this.readyState == 4) {
		puts("Complete.\nBody length: " + this.responseText.length);
		puts("Body:\n" + this.responseText);
	}
};

xhr.open("GET", "http://driverdan.com");
xhr.send();
