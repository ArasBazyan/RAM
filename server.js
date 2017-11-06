var express = require("express");
var app     = express();
var path    = require("path");
var sqlite3 = require("sqlite3").verbose();


var db = new sqlite3.Database('Volvo.db');



var rowid;



db.serialize(function() {


    db.each("SELECT rowid AS id, info FROM user_info", function(err, row) {
        rowid = row.id;
        console.log(row.id + ": " + row.info + " ----- "  + rowid);
    });
});


db.close();


var loadID = function (req, res, next) {
        var id = req.params.id;
        var info = rowid;
        if(info){
            req.info = info;
            next();
        } else {
            next(new Error("Failed to load " + id));

        }


}


app.use(express.static(path.join(__dirname, '/public')));


app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/adminview.html'));
});

app.get('/adminView',function(req,res){
    res.sendFile(path.join(__dirname+'/adminview.html'));

});

app.get('/projectDetail/:id', loadID, function (req, res) {
    res.send('Seeing user ' + req.info);
    
})

/*
app.get('/projectDetail/:id',function(req,res){
    res.sendFile(path.join(__dirname+'/projectDetail.html'));
    var id = req.params.id;
    var query = "select * from user_info where ID = " + id;

    console.log(req.params.id + " ---- " + query);
});
*/
app.get('/nodeAdmin',function(req,res){
    res.sendFile(path.join(__dirname+'/nodeAdmin.html'));
});

app.listen(3000);

console.log("Running at Port 3000");