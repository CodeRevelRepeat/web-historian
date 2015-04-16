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
      console.log('pathname:', pathname);
      var baseFolder = '';

      if(pathname === '/' || pathname === "/index.html" ||
        pathname === '/loading.html' || pathname === '/styles.css'){
        if(pathname === '/'){
          pathname = '/index.html';
        }
        baseFolder = archive.paths['siteAssets'];
      } else {
        baseFolder = archive.paths['archivedSites'];
      }

      httpHelpers.serveAssets(response, baseFolder + '/' + path.basename(pathname), function(data){
        var headers = {'Content-Type': 'text/html'};
        if (mimeTypes[path.extname(pathname)]) {
          headers['Content-Type'] = mimeTypes[path.extname(pathname)];
        }
        httpHelpers.sendResponse(response, data, 200, headers);
      });
    }
  ,
  'POST': function(request, response){
    var pathname = urlParser.parse(request.url).pathname;
    if (pathname === '/') {
      httpHelpers.collectData(request, function(data){
        var dataParsed = querystring.parse(data);
        var url = dataParsed.url;
        httpHelpers.appendToFile(archive.paths.list, url + '\n', function() {

          archive.addUrlToList(url);
          var redirect = "./loading.html";

          archive.isURLArchived(url, function(exists){
            if(exists){
              redirect =  '../archives/sites/' + url;
            }

            var redirectHeader = {
             Location: redirect
            };

            httpHelpers.sendResponse(response, 'DONE', 302, redirectHeader);
          });



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
