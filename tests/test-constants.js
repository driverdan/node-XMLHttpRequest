include("common.js");

var xhr = new XMLHttpRequest();

// Test constant values
assertEquals(0, xhr.UNSENT);
assertEquals(1, xhr.OPENED);
assertEquals(2, xhr.HEADERS_RECEIVED);
assertEquals(3, xhr.LOADING);
assertEquals(4, xhr.DONE);

puts("done");
