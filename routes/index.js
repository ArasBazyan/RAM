var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('adminview');
});

//Get Roots to employee
router.get('/:id')

// Route to AdminView, based on Person. Maybe idManager?
router.get('/:id', function (req, res, next) {
    var db = new sqlite3.Database('./Volvo.db');
    var iddata;
    var teamData;
    var lock = 2;
    db.serialize(function () {
        db.each("SELECT * FROM Person where idPerson = " + req.params.id, (err, rows) => {
            if (err) {
                console.error(err);
            } else {
                iddata = rows;
                lock -= 1;


                console.log('\n iddata:  ' + JSON.stringify(iddata));

            }

            if (lock === 0) {
                sendData();
            }

        });


        db.all("SELECT * FROM Person  INNER JOIN Organization on Person.idOrganization = Organization.idParentOrganization where Person.Manager=1 AND Person.idPerson = " + req.params.id, (err, rows) => {
            if (err) {


                console.error(err);
            } else {
                teamData = rows;
                lock -= 1;

                console.log('\n teamData: ' + JSON.stringify(teamData));


            }

            if (lock === 0) {
                sendData();
            }

        });


        var sendData = function () {
            console.log('\n EGG2 ' + JSON.stringify(iddata));
            console.log('\n BEANS2 ' + JSON.stringify(teamData));
            res.render('adminview', {
                output: req.params.id,
                data: iddata,
                teamData: teamData
            });
        }


    });


    db.close();
});


// Route to AdminView, based on Person. Maybe idManager?
router.get('/:id', function (req, res, next) {
    var db = new sqlite3.Database('./Volvo.db');
    var iddata;
    var teamData;
    var lock = 2;
    db.serialize(function () {
        db.each("SELECT * FROM Person where idPerson = " + req.params.id, (err, rows) => {
            if (err) {
                console.error(err);
            } else {
                iddata = rows;
                lock -= 1;


                console.log('\n iddata:  ' + JSON.stringify(iddata));

            }

            if (lock === 0) {
                sendData();
            }

        });


        db.all("SELECT * FROM Person  INNER JOIN Organization on Person.idOrganization = Organization.idParentOrganization where Person.idPerson = " + req.params.id, (err, rows) => {
            if (err) {
                console.error(err);
            } else {
                teamData = rows;
                lock -= 1;


                console.log('\n teamData: ' + JSON.stringify(teamData));


            }

            if (lock === 0) {
                sendData();
            }

        });


        var sendData = function () {
            console.log('\n EGG2 ' + JSON.stringify(iddata));
            console.log('\n BEANS2 ' + JSON.stringify(teamData));
            res.render('adminview', {
                output: req.params.id,
                data: iddata,
                teamData: teamData
            });
        }


    });


    db.close();
});


/**
 * fetching all projects for manager
 */
router.get('/table/:idManager', function (req, res, next) {
    var db = new sqlite3.Database('./Volvo.db');
    db.serialize(function () {

        //res.render(projectDetail.html);
// Query
        db.all("SELECT Project.idProject, Project.ProjectName, Project.Version, Person.FirstName, Project.dateEnd FROM Project "
            + "INNER JOIN Person ON Project.idManager = Person.idPerson "
            + "WHERE idManager = ?", [req.params.idManager], function (err, rows) {
            // If error
            if (err) {
                console.error(err);
                res.status(500);    // Server Error
                res.json({"error": err});


            } else {
                // Check if there is a project
                if (rows == undefined) {
                    // If Project not found
                    res.status(404);
                    res.json({"error": "Resource not found"});
                } else {
                    // Success
                    res.status(200);  // OK
                    res.json(rows);
                }
            }
        });
    });
    db.close();

});


//This route maybe, later?
router.post('/:idManager/addproject', function (req, res, next) {
    var projname = req.body.projectname;
    var sop = req.body.startofproduction;
    var projectdescription = req.body.projectdescription;
    var parentId = req.params.nodeId;
    var projectId = req.params.projectId;


    console.log('All data: ' + JSON.stringify(req.body));
    console.log('pname: ' + projname);
});


//POST Create Project
router.post('/createProject/:id', function (req, res, next) {
    var lock = 2;

    var pname = req.body.projname;
    var pdescription = req.body.projectDescription;
    var calcdeadline = req.body.calcDeadline;
    var sop = req.body.sop;
    var id = req.params.id;

    console.log('All data: ' + JSON.stringify(req.body));
    console.log('pname: ' + pname);
    console.log("sop: " + sop);
    console.log("pDesc: " + pdescription);
    console.log('calcDead: ' + calcdeadline);
    console.log("affected: " + req.body.selectedGroups);

    var affected = req.body.selectedGroups;


    var db = new sqlite3.Database('./Volvo.db');

    db.run(`INSERT INTO Project (ProjectName, ProjectDescription, Version, VersionLocked, idManager, dateEnd, StartofProduction)
            VALUES(?,?,?,?,?,?,?)`, [pname, pdescription, 1, 0, id, calcdeadline, sop], function (err) {
        if (err) {
            console.log("error: " + pname + " " + pdescription + " " + calcdeadline + " " + sop);
            console.log("error in node.js");
            return console.log(err.message);
        } else {

            insertedPid = `${this.lastID}`;
            console.log(" insertedPid here: " + insertedPid);
            insertNode();
            console.log('A row has been inserted with rowid ${this.lastID}');
        }
    });


    function insertNode() {
        for (var i = 0; i < affected.length; i++) {
            db.each("SELECT idPerson from Person WHERE Manager = 1 AND idOrganization = " + affected[i], (err, rows) => {
                if (err) {

                    console.log("error in node.js");
                    return console.log(err.message);
                } else {
                    console.log("!C idResponsible: " + rows.idPerson);
                    var idResponsible = rows.idPerson;

                    db.run(`INSERT INTO Node ( idProject, idResponsible, idNodeType)
                    VALUES (?,?,?)`, [insertedPid, idResponsible, 3], function (err) {
                        if (err) {
                            console.log("error in node.js");
                            return console.log(err.message);
                        } else {
                            console.log(`New idPersonNodeResource is: ${this.lastID}`);
                        }
                    });

                    console.log('A row has been inserted with rowid ${this.lastID}');
                }
            })

        }

    };


});


//Creating Organization

router.post('/createOrganization/:id', function (req, res) {
    //var data = req.body;

    var organizationName = req.body.organizationName;
    var id = req.params.id;

    console.log(JSON.stringify(req.body));
    //res.send("data")
    var db = new sqlite3.Database('./Volvo.db');

    db.run(`INSERT INTO Organization (OrganizationName, idParentOrganization)
            VALUES(?,?)`, [organizationName,id], function (err) {
        if (err) {
            console.log("error:", organizationName,id );
            console.log("error in node.js");
            return console.log(err.message);
        } else {
            console.log('Success ');
        }
    });

    db.close();

    res.redirect('/');


});


//Creating Employee

router.post('/createEmployee/:id', function (req, res) {
    //var data = req.body;
    var employeeName = req.body.employeeName;
    var employeeLastName = req.body.employeeLastName;
    var employeeCdsi=req.body.employeeCdsi;
    var id= req.params.id;

    console.log(JSON.stringify(req.body));
    console.log("selected: " + req.body.selectedOrganizations);
    //res.send("data")
    var childrenGroup= req.body.selectedOrganizations;

    var db = new sqlite3.Database('./Volvo.db');

    db.run(`INSERT INTO Person (FirstName, LastName, idRoleType, idOrganization, Manager)
            VALUES(?,?,?,?)`, [employeeName, employeeLastName,employeeCdsi,id, false], function (err) {
        if (err) {
            console.log("error:" + employeeName + " " + employeeLastName + " " + employeeCdsi + " " + id + " " + false);
            console.log("error in node.js");
            return console.log(err.message);
        } else {

            var gManager= '${this.lastID}';
            console.log(" assign group manager: " + gManager);
            //db.run('UPDATE Person SET Manager=true WHERE ID= \"$gManager\" ');
            assignManager();
            console.log('Success the child manager is has been updated'+ gManager);
        }
    });

    function assignManager(){
        for (var i=0; i<childrenGroup.length();i++){
            db.run('SELECT OrganizationName from Organization WHERE Manager = id'+ selectedOrganizations[i], (err,rows) =>{
                if (err){
                    console.log("error in node.js");
                    return console.log(err.message);
                }else{
                    var allGroups=[];
                    allGroups=rows.OrganizationName;
                    db.run
                }
            })
        }
    }
    db.close();

    res.redirect('/');


});


module.exports = router;