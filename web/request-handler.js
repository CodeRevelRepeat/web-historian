var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var urlParser = require('url');

// require more modules/folders here!


var actions = {
  'GET': function(request, response){
      var pathname = urlParser.parse(request.url).pathname;
      var baseFolder = '';
      archive.readListOfUrls();
      console.log('pathname', pathname);
      console.log('archive.isUrlInList',archive.isUrlInList(pathname.slice(1)));
      console.log('url list', archive.urlList);

      if(pathname === '/'){
        baseFolder = archive.paths['siteAssets'];
        pathname = '/index.html';
      } else if (archive.isUrlInList(pathname.slice(1))) {
        baseFolder = archive.paths.archivedSites;
      }
      console.log('baseFolder', baseFolder);
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
