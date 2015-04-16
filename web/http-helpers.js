var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

var headers = exports.headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {

  fs.readFile(asset, function (err, data) {
    if (err){
      sendResponse(res, undefined, 404); //come back later
      return;
    }
    callback(data);
  });


  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
};



// As you progress, keep thinking about what helper functions you can put here!

exports.sendResponse = sendResponse = function(response, data, statusCode, headers){
  statusCode = statusCode || 200;
  headers = headers || exports.headers;
  response.writeHead(statusCode, headers);
  response.end(data);
};

exports.collectData = function(request, callback){
  var data = "";
  request.on('data', function(chunk){
    data += chunk;
  });
  request.on('end', function(){
    callback(data);
  });
};

exports.appendToFile = function(filePath, data, callback) {
  fs.appendFile(filePath, data, callback);
};




