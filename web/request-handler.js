var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!


var actions = {
  'GET': function(request, response){
      httpHelpers.serveAssets(response, path.join(__dirname, '/public/index.html'), function(data){

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
