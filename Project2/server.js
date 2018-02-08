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
    console.log('serving');
    fs.readdir(path.slice(1),function(err, files){
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
                    return "<li><a href='" +path.replace(/\/public/g, '')+'/'+ item + "'>" +  item + "</a></li>";
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
    if(uri.path == "/favicon.ico"){
        console.log('fav');
        res.end('favico');
        return;
    } 
    var filePath;
    if(uri.path == "/"){
        filePath = "/public";
    }else{
    filePath = "/public"+uri.path;
    }
    var check = checkDir(filePath.slice(1), res);
    if(check.isDirectory()){
        console.log("is a dir");
        serveIndex(filePath, res);
    }else if(check.isFile()){
        console.log("is a file");
        if(fs.existsSync(filePath.slice(1))){
            console.log("file exists");
            getFile(filePath.slice(1), res);
        } else{
            res.statusCode = 404;
            res.end("File Not Found");
        }
    } else{
        res.statusCode = 404;
        res.end("File Not Found");
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
        }
        console.log("read file");
        res.end(data);
    });
}
/** @function checkDir
 * this function gets the stat object so that we can see whether the path is a file or a directory
 * @param {string} filename - name of file to read
 */
function checkDir(name, res){
    console.log("checking dir: " +name);
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
});