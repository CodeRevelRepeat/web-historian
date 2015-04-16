var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var urlParser = require('url');
var querystring = require('querystring');

// require more modules/folders here!
var mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/js'
};

var actions = {
  'GET': function(request, response){
      var pathname = urlParser.parse(request.url).pathname;
      var baseFolder = '';

      if(pathname === '/' || pathname === "/index.html" ||
        pathname === '/loading.html' || pathname === '/styles.css'){
        if(pathname === '/'){
          pathname = '/index.html';
        }
        baseFolder = archive.paths['siteAssets'];

      }
      // else if (archive.isUrlInList(pathname.slice(1))) {
      //   baseFolder = archive.paths.archivedSites;
      // }
      else {
        baseFolder = archive.paths['archivedSites'];
      }

      httpHelpers.serveAssets(response, baseFolder + pathname, function(data){
        console.log('in callback of serveAssets');
        console.log('pathname:', pathname);
        if (mimeTypes[path.extname(pathname)]) {
          console.log('found mimeType');
          httpHelpers.headers['Content-Type'] = mimeTypes[path.extname(pathname)];
        }
        httpHelpers.sendResponse(response, data, 200);
      });
    }
  ,
  'POST': function(request, response){
    var pathname = urlParser.parse(request.url).pathname;
    if (pathname === '/') {
      httpHelpers.collectData(request, function(data){
        var dataParsed = querystring.parse(data);
        dataParsed = dataParsed.url;
        httpHelpers.appendToFile(archive.paths.list, dataParsed + '\n', function() {
          archive.addUrlToList(request._postData.url);
          httpHelpers.sendResponse(response, 'DONE', 302);
        });
      });
    }
  },
  // 'OPTIONS': function(request, response){
  //   utils.sendResponse(response);
  // }
};





exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if( action ){
    action(req, res);
  } else {
    httpHelpers.sendResponse(res, "Not Found", 404);
  }
  // res.end(archive.paths.list);
};
