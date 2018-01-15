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
                personID: req.params.id,
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
        var idResponsible = 0;
        parseInt(idResponsible);

        for (var i = 0; i < affected.length; i++) {
            idResponsible = 0;
            db.each("SELECT Person.idPerson, Organization.OrganizationName FROM Person JOIN Organization on Person.idOrganization = Organization.idOrganization WHERE Person.Manager = 1 AND Organization.idOrganization =  " + affected[i], (err, rows) => {
                if (err) {

                    console.log("error in node.js");
                    return console.log(err.message);
                } else {

                    idResponsible = rows.idPerson;
                   var groupName = rows.OrganizationName;
                    if(idResponsible == 0){
                        console.log("YES IT IS 0")
                        idResponsible = id;
                    }

                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth()+1;
                    var dt = date.getDate();

                    if (dt < 10) {
                        dt = '0' + dt;
                    }
                    if (month < 10) {
                        month = '0' + month;
                    }

                    var today = year+'-' + month + '-'+dt;
                    console.log("today  " + today);


                    db.run(`INSERT INTO Node ( idProject, idParentNode, idResponsible, idNodeType, dateStart, dateEnd, Version, Completed, Archived, Comments)
                    VALUES (?,?,?,?,?,?,?,?,?,?)`, [insertedPid, 0, idResponsible, 3, today, calcdeadline, 1, 0,0, groupName], function (err) {
                        if (err) {
                            console.log("error in node.js");
                            return console.log(err.message);
                        } else {
                            console.log(`New nodeID is: ${this.lastID}`);
                        }
                    });

                    console.log('A row has been inserted with rowid ${this.lastID}');
                }
            })

        }
        // db.close();
    };


    res.redirect('/admin/' + id);


});
//End of create project


//Creating Organization

router.post('/createOrganization/:id', function (req, res) {
    var organizationName = req.body.organizationName;
    var id = req.params.id;

    console.log(JSON.stringify(req.body));
    var db = new sqlite3.Database('./Volvo.db');


    var idOrganization;

    db.each('SELECT idOrganization FROM Person WHERE idPerson=' + id, (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            idOrganization = rows;
            console.log(' HERE idOrganization ' + JSON.stringify(rows.idOrganization));

            //rows is idOrganization
            db.run(`INSERT INTO Organization (OrganizationName, idParentOrganization)
            VALUES(?,?)`, [organizationName,rows.idOrganization], function (err) {
                if (err) {
                    console.log("error in node.js");
                    return console.log(err.message);
                } else {
                    console.log(' Success, idOrganization of new ORG ' + JSON.stringify(rows.idOrganization));

                }
            });

        }
    });


  //  db.close();

    res.redirect('/');


});
//End of creating organization

//Creating Employee

router.post('/createEmployee/:id', function (req, res) {
    //var data = req.body;
    var employeeName = req.body.employeeName;
    var employeeLastName = req.body.employeeLastName;
    var employeeCdsi=req.body.employeeCdsi;
    var id= req.params.id;

    console.log(JSON.stringify(req.body));
    var selectedOrganizations = req.body.selectedOrganizations;

    var db = new sqlite3.Database('./Volvo.db');

    console.log(" PARSEED ORG ID " + JSON.parse(selectedOrganizations) );



    selectedOrganizations = JSON.parse(selectedOrganizations);


    db.run(`INSERT INTO Person (FirstName, LastName, idRoleType, idOrganization, Manager)
            VALUES(?,?,?,?,?)`, [employeeName, employeeLastName,employeeCdsi, selectedOrganizations , 1], function (err) {
        if (err) {
            console.log("error:" + employeeName + " " + employeeLastName + " " + employeeCdsi + " " + id + " " + false);
            console.log("error in node.js");
            return console.log(err.message);
        } else {

            var gManager = `${this.lastID}`;
            console.log(" new group manager ID: " + gManager);


            /*
            var allGroups;
            db.all('SELECT * FROM Organization JOIN Person on Person.idOrganization = Organization.idParentOrganization ' +
                'WHERE Person.idPerson=' + id, (err, rows) => {
                if (err) {
                    console.error(err);
                } else {
                    allGroups = rows;
                    //lock-=1;
                    console.log('allGroups' + JSON.stringify(allGroups));
                    db.run('UPDATE Person SET Manager=1 WHERE idPerson=' + gManager, function (err) {
                            if (err) {
                                console.log('error in node.js');
                                return console.log(err.message);
                            } else {
                                console.log('ID of the created employee' + gManager);
                            }
                        });

                }
            });
            */


        }
        });
  //  db.close();
    res.redirect('/admin/'+id);
});

module.exports = router;
//End of creating Employee