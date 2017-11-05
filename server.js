var express = require("express");
var app     = express();
var path    = require("path");



app.use(express.static(path.join(__dirname, '/public')));


app.get('/',function(req,res){
    res.sendfile(path.join(__dirname+'/adminview.html'));
});

app.get('/adminView',function(req,res){
    res.sendFile(path.join(__dirname+'/adminview.html'));
});

app.get('/projectDetail',function(req,res){
    res.sendFile(path.join(__dirname+'/projectDetail.html'));
});

app.get('/nodeAdmin',function(req,res){
    res.sendFile(path.join(__dirname+'/nodeAdmin.html'));
});

app.listen(3000);

console.log("Running at Port 3000");