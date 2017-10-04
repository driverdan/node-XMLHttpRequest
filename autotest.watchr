def run_all_tests
    puts `clear`

    Dir["tests/*.js"].each do |file|
        puts `node #{file}`
    end
=begin
    puts `node tests/test-constants.js`
    puts `node tests/test-headers.js`
    puts `node tests/test-request-methods.js`
    puts `node tests/test-request-protocols.js`
    puts `node tests/test-streaming.js`
=end
end
watch('.*.js') {run_all_tests}
run_all_tests
