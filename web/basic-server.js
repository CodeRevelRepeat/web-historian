var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");
var urlParser = require('url');
var httpHelpers = require('./http-helpers');

// Why do you think we have this here?
// HINT:It has to do with what's in .gitignore
initialize();

var server = http.createServer(handler.handleRequest);

var port = 8080;
var ip = "127.0.0.1";

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
