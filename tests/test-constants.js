include("common.js");

// Test constant values
assertEquals(xhr.UNSENT, 0);
assertEquals(xhr.OPENED, 1);
assertEquals(xhr.HEADERS_RECEIVED, 2);
assertEquals(xhr.LOADING, 3);
assertEquals(xhr.DONE, 4);

puts("done");
