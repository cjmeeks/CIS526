"use strict";

// PORT definition
const PORT = 3095;

// Import the HTTP library
const http = require('http');

// Import the fs library 
const fs = require('fs');
const qs = require('querystring');
const url = require('url');
const path = require('path');

/**@function serveIndex
 *  serving the index
 * @param {http.ServerResponse} res - server response object 
 */
function serveIndex(path,res){
    fs.readdir(path,function(err, files){
        if(err){
            console.error(err);
            res.statusCode = 500;
            res.end("Server Error serving index: " + path);
        }
        console.log(files);
        if(files.includes('index.html')){
            getFile(path+"\\" + "index.html", res);
        } else{
            var html = "<p>Index of " + path + "</p>";
            html += "<ul>";
            html += files.map(function(item){
                        return "<li><a href='" + item + "'>" + path +'/'+ item + "</a></li>";
                    }).join("");
            html += "</ul>";
            res.end(html);
        }
    });
}
/**@function handleRequest
 * handles request coming into the server
 * @param {http.ClientRequest} req - request object
 * @param {http.ServerResponse} res - response object 
 */
function handleRequest(req, res) {
  var uri = url.parse(req.url);
  var filePath = uri.path.slice(1);
  if(filePath == "favicon.ico"){
      res.end('favico');
  } else{
    var check = checkDir(filePath, res);
    if(check.isDirectory()){
        serveIndex(filePath, res);
    }else if(check.isFile()){
        if(fs.existsSync(filePath)){
        getFile(filePath, res);
        } 
    } else{
            res.statusCode = 404;
            res.end("File Not Found");
    }
  }
  
}
/** @function getFile
 * this function gets the file specified and response to request accordingly
 * @param {string} filename - name of file to read
 * @param {http.serverResponse} res  - response object to response to the request
 */
function getFile(filename, res){
    fs.readFile(filename, function(err, data){
        if(err){
            console.log(err);
            res.statusCode = 500;
            res.end("Server Error getting file");
            return;
        }
        res.end(data);
    });
}
/** @function checkDir
 * this function gets the file specified and response to request accordingly
 * @param {string} filename - name of file to read
 */
function checkDir(name, res){
  return fs.statSync(name, function(err, stats){
      if(err){
          console.log(err);
          res.statusCode = 500;
          res.end("Server Error is directory");
      }
      console.log(stats);
      return stats;
  });
}
// Create the web server
var server = http.createServer(handleRequest);

// Start listening on port PORT
server.listen(PORT, function(){
    console.log("Listening on port " + PORT);
    // console.log(path.resolve(__dirname, 'test'));
});