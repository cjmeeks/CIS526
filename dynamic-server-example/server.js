"use strict";

const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const url = require('url');
const PORT = 8090;

var students = JSON.parse(fs.readFileSync("students.json", {encoding: 'utf8'}));

function escapeHTML(html){
    return html.replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function handleRequest(req, res){
    var uri = url.parse(req.url);
    var params;
    if (uri.search){
        params = qs.parse(uri.search.slice(1));
    }

    if (params.name){
        students.push({
            name: escapeHTML(params.name),
            eid: escapeHTML(params.eid),
            description: escapeHTML(params.description)
        });
    }

    var html = "<!doctype html>";
    html += "   <html>";
    html += "       <head>";
    html += "           <title>Hello World</title>";
    html += "       </head>";
    html += "       <body>";
    html += "           <h1>Hello World</h1>";
    html += studentList();
    html += studentForm();
    html += "       </body>";
    html += "   </html>";

    res.setHeader("ContentType", "text/html");
    res.end(html);
}

function studentForm(){
    var form = "<form>";
    form += "   <fieldset>";
    form += "       <label for'name'>Student Name </label>";
    form += "       <input type'text' name='name'/>";
    form += "   </fieldset>";
    form += "   <fieldset>";
    form += "       <label for'eid'>Student Eid</label>";
    form += "       <input type'text' name='eid'/>";
    form += "   </fieldset>";
    form += "   <fieldset>";
    form += "       <label for'des'>Student Description</label>";
    form += "       <textarea name='des'></textarea>";
    form += "       <input type='submit'/>";
    form += "   </fieldset>";
    form += "<form>";
    return form;
}
function studentList(){
    return students.map(function(item){return item.name}).join(",");
}

var server = http.createServer(handleRequest);
server.listen(PORT, function() {
    console.log("Listening on port " + PORT);
});