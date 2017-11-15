var express = require("express");
var app     = express();
var path    = require("path");
var sqlite3 = require("sqlite3").verbose();
var bodyParser = require('body-parser');



app.use(express.static(path.join(__dirname, '/public')));

var db = new sqlite3.Database('Volvo.db');


/* Config (request) and (response) */
app.use(bodyParser.json()); // Body parser use JSON data
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


//Support for CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,    Content-Type, Accept");
    next();
});


db.serialize(function() {

    // insert
    /*
    db.each("INSERT INTO Project (ProjectName, ProjectDescription, Version, VersionLocked, idManager, dateStart, dateEnd, StartofProduction, ProjectComments)"
       + "VALUES ('NT-982','lala','3','NO','4', '01.12.2017', '01.12.2017', '01.12.2017', 'lala')", function(err, rows) {
        if (err) {
            console.error(err);
        } else {
            console.log("ProjId: " + rows.idProject + " has name: " + rows.ProjectName);
        }
    });
    */

    /*
    db.each("INSERT INTO Person (FirstName, LastName) "
       + "VALUES ('Sime','Colak')", function(err, rows) {
        if (err) {
            console.error(err);
        } else {
            console.log("Person: " + rows.idPerson + " has name: " + rows.FirstName);
        }
    });
    */

    db.each("SELECT idPerson FROM Person", function(err, row) {
        rowid = row.idPerson;
        console.log("row.id : " + rowid);
    });

    db.each("SELECT idProject , ProjectName FROM Project WHERE idProject = ?", [3],    function(err, rows) {
        if (err) {
            console.error(err);
        } else {
            console.log("ProjId: " + rows.idProject + " has name: " + rows.ProjectName);

        }
    });



    db.each("SELECT * FROM Project", function(err, rows) {
        if (err) {
            console.error(err);

        } else {
            console.log('\n' + JSON.stringify(rows));

        }
    });
});


//db.close();






app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/adminview.html'));
});

app.get('/adminView',function(req,res){
    res.sendFile(path.join(__dirname+'/adminview.html'));

});

/**
* fetching all projects for manager
*/
app.get('/projectDetail/:idManager', function(req, res, next) {

    //res.render(projectDetail.html);
// Query
    db.all("SELECT Project.ProjectName, Project.Version, Project.ProjectComments, Person.FirstName, Project.dateEnd FROM Project "
         + "INNER JOIN Person ON Project.idManager = Person.idPerson "
         + "WHERE idManager = ?", [req.params.idManager] ,    function(err, rows) {
        // If error
        if (err) {
            console.error(err);
            res.status(500);    // Server Error
            res.json({ "error" : err });


        } else {
            // Check if there is a project
            if(rows == undefined) {
                // If Project not found
                res.status(404);
                res.json({ "error" : "Resource not found" });
            } else {
                // Success
                res.status(200);  // OK

                //res.render(path.join(__dirname+'/projectDetail.html'));

               // console.log("got ittt  " + JSON.stringify(rows));

                res.json(rows);

                //res.sendFile(path.join(__dirname+'/projectDetail.html'));

            }
        }
        //res.end();
    });

});

/**
* this for fetching specific project
*/
app.get('/projectDetail/:idManager/:idProject', function(req, res, next) {

    //res.render(projectDetail.html);
// Query
    db.all("SELECT * FROM Project WHERE idManager = ? AND idProject = ? ", [req.params.idManager , req.params.idProject],    function(err, rows) {
        // If error
        if (err) {
            console.error(err);
            res.status(500);    // Server Error
            res.json({ "error" : err });


        } else {
            // Check if there is a project
            if(rows == undefined) {
                // If Project not found
                res.status(404);
                res.json({ "error" : "Resource not found" });
            } else {
                // Success
                res.status(200);  // OK

                //res.render(path.join(__dirname+'/projectDetail.html'));

               // console.log("got ittt  " + JSON.stringify(rows));

                res.json(rows);

                //res.sendFile(path.join(__dirname+'/projectDetail.html'));

            }
        }
        //res.end();
    });

});


app.get('/projectDetail/',function(req,res){
    res.sendFile(path.join(__dirname+'/projectDetail.html'));

    console.log(req.params.id);
});


app.get('/nodeAdmin',function(req,res){
    res.sendFile(path.join(__dirname+'/nodeAdmin.html'));
});





app.listen(3000);

console.log("Running at Port 3000");


