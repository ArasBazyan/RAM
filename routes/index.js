var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();



router.get('/favicon.ico', function(req, res) {
    res.status(204);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adminview');
});



// Route to AdminView, based on Person. Maybe idManager?
router.get('/:id', function(req, res, next) {
    var db = new sqlite3.Database('./Volvo.db');
    db.serialize(function() {
        db.each("SELECT * FROM Person where idPerson = " + req.params.id , (err, rows)=>{
            if (err){
                console.error(err);
            } else {
                console.log('\n Cheese' + JSON.stringify(rows));
                res.render('adminview', {
                    output: req.params.id,
                    data: rows
                });

            }
        });
    });
    db.close();
});




//This route maybe, later?
router.post('/:idManager/addproject', function(req, res, next){
    var projname = req.body.projectname;
    var sop = req.body.startofproduction;
    var projectdescription = req.body.projectdescription;
    var parentId = req.params.nodeId;
    var projectId = req.params.projectId;


    console.log('All data: ' + JSON.stringify(req.body));
    console.log('pname: ' + projname);
});



//POST Create Project
router.post('/createProject', function(req, res){
    var pname = req.body.projname;
    var pdescription = req.body.projectDescription;
    var calcdeadline = req.body.calcDeadline;
    var sop = req.body.sop;

    console.log('All data: ' + JSON.stringify(req.body));
    console.log('pname: ' + pname);
    console.log("sop: " + sop);
    console.log("pDesc: " + pdescription);
    console.log('calcDead: ' + calcdeadline);
    console.log("affected: " + req.body.selectedGroups);



    var db = new sqlite3.Database('./Volvo.db');

    db.run(`INSERT INTO Project (ProjectName, ProjectDescription, Version, VersionLocked, idManager, dateEnd, StartofProduction)
            VALUES(?,?,?,?,?,?,?)`, [pname, pdescription, 1, 0, 1,calcdeadline, sop], function(err) {
      if (err){
        console.log("error: "+ pname + " " + pdescription + " " + calcdeadline + " " + sop);
        console.log("error in node.js");
        return console.log(err.message);
    } else {
        console.log('A row has been inserted with rowid ${this.lastID}');
      }
    });

    db.close();

    res.redirect('/');


});


//Creating Root

router.post('/createRoot', function(req, res){
    //var data = req.body;
    var rName = req.body.rootName;
    var rDescription = req.body.rootDescription;
    //var isParentOrganization=req.body.isParent;
    console.log(JSON.stringify(req.body));
    //res.send("data")
    var db = new sqlite3.Database('./Volvo.db');

    db.run(`INSERT INTO Organization (OrganizationName, idParentOrg)
            VALUES(?,?)`, [rName, rDescription], function(err) {
        if (err){
            console.log("error:", rName + " " +rDescription );
            console.log("error in node.js");
            return console.log(err.message);
        } else {
            console.log('Success');
        }
    });

    db.close();

    res.redirect('/');


});


//Creating Employee

router.post('/createEmployee', function(req, res){
    //var data = req.body;
    var employeeName = req.body.employeeName;
    var employeeLastName = req.body.employeeLastName;
    var employeeCdsi=req.body.employeeCdsi;
    console.log(JSON.stringify(req.body));
    //res.send("data")
    var db = new sqlite3.Database('./Volvo.db');

    db.run(`INSERT INTO Person (FirstName, LastName, idRoleType, idOrganization)
            VALUES(?,?,?,?)`, [employeeName, employeeLastName, employeeCdsi], function(err) {
        if (err){
            console.log("error:", employeeName + " " +employeeLastName + " " +employeeCdsi );
            console.log("error in node.js");
            return console.log(err.message);
        } else {
            console.log('Success');
        }
    });

    db.close();

    res.redirect('/');


});


module.exports = router;
