var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http_request = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

var paths = exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
//
var urlList = exports.urlList = [];

exports.readListOfUrls = function(callback){
  fs.readFile(paths.list, 'utf8', function(err, data) {
    if(err) {
      throw err;
    }
    urlList = data.toString().split("\n");
    //callback function allows us to manipulate urlList
    callback(urlList);
  });
};

exports.isUrlInList = function(url){
    return _.contains(urlList, url);
};

exports.addUrlToList = function(url){
  urlList.push(url);
};

// //synch version
// exports.isURLArchived = function(url){
//   console.log('in isURLArchived with url:', url);
//   return fs.existsSync(paths.archivedSites + '/' + url);
// };


//refactor to asynch
exports.isURLArchived = function(url, callback){

  fs.exists(paths.archivedSites + '/' + url, function(exists){
    callback(exists);
  });
};




exports.downloadUrls = function(url){
  http_request.get({
    url: url,
  }, paths.archivedSites + '/' + url, function (err, res) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(res.code, res.headers, res.file);
  });

};
