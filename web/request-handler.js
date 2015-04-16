var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var urlParser = require('url');

// require more modules/folders here!


var actions = {
  'GET': function(request, response){
      var pathname = urlParser.parse(request.url).pathname;
      var baseFolder = '';

      console.log('requesting index');
      if(pathname === '/' || pathname === "/index.html" ||
        pathname === '/loading.html' || pathname === 'styles.css'){
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
  // ,
  // 'POST': function(request, response){
  //   utils.collectData(request, function(message){
  //     message.objectId = ++objectId;
  //     messages.push(message);
  //     utils.sendResponse(response, {objectId: 1}, 201);
  //   });
  // },
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
