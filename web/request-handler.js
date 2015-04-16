var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var urlParser = require('url');

// require more modules/folders here!


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

        httpHelpers.sendResponse(response, data, 200);
      });
    }
  ,
  'POST': function(request, response){
    var pathname = urlParser.parse(request.url).pathname;
    if (pathname === '/') {
      httpHelpers.collectData(request, function(data){
        archive.appendToFile(archive.paths.list, data, function() {
          archive.addUrlToList(request._postData.url);
          console.log('urlList',archive.urlList);
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
