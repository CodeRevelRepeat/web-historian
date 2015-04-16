var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");
var urlParser = require('url');
var httpHelpers = require('./http-helpers');

// Why do you think we have this here?
// HINT:It has to do with what's in .gitignore
initialize();



var routes = {
  '/': handler.requestHandler
  // ...
};




var server = http.createServer(function(request, response){
  console.log("Serving request type " + request.method + " for url " + request.url);

  var parts = urlParser.parse(request.url);
  var route = routes[parts.pathname];

  if( route ){
    route(request, response);
  } else {
    httpHelpers.sendResponse(response, "Not Found", 404);
  }
});




var port = 8080;
var ip = "127.0.0.1";

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
