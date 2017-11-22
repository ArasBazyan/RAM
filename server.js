var express = require("express");
var app     = express();
var path    = require("path");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var sqlite3 = require("sqlite3").verbose();
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');


var index = require('./routes/index');
var node = require('./routes/node');
var projectdetail = require('./routes/projectdetail');
var calculations = require('./routes/calculations');

var app = express();

var db = new sqlite3.Database('Volvo.db');

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


/* Config (request) and (response) */
 // Body parser use JSON data
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Support for CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,    Content-Type, Accept");
    next();
});

app.use('/', index);
app.use('/node', node);
app.use('/projectdetail', projectdetail);
app.use('/calculations', calculations);
/*
db.serialize(function() {

    // insert
    /*
    db.each("INSERT INTO Project (ProjectName, ProjectDescription, Version, VersionLocked, idManager, dateStart, dateEnd, StartofProduction, ProjectComments)"
       + "VALUES ('NT-982','lala','3','NO','6', '01.12.2017', '01.12.2017', '01.12.2017', 'lala')", function(err, rows) {
        if (err) {
            console.error(err);
        } else {
            console.log("ProjId: " + rows.idProject + " has name: " + rows.ProjectName);
        }
    });
    */

    /*
    db.each("INSERT INTO Person (FirstName, LastName) "
       + "VALUES ('Emieli','Larsson')", function(err, rows) {
        if (err) {
            console.error(err);
        } else {
            console.log("Person: " + rows.idPerson + " has name: " + rows.FirstName);
        }
    });
    */
/*
    db.each("SELECT FirstName FROM Person", function(err, row) {
        rowid = row.FirstName;
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






/*app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/adminview.html'));
});

app.get('/adminView',function(req,res){
    res.sendFile(path.join(__dirname+'/adminview.html'));

});

/**
* fetching all projects for manager
*//*
app.get('/adminView/:idManager', function(req, res, next) {

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
*//*
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
});*/





app.listen(3000);

console.log("Running at Port 3000");
