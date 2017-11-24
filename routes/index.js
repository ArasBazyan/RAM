var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adminview');
});




router.get('/:id', function(req, res, next) {
    var db = new sqlite3.Database('./Volvo.db');
    db.serialize(function() {
        db.each("SELECT idPerson FROM Person where idPerson = " + req.params.id , (err, rows)=>{
            if (err){
                console.error(err);
            } else {
                console.log('\n banana' + JSON.stringify(rows));
                res.render('adminview', {
                    output: req.params.id,
                    data: rows
                });

            }
        });
    });
    db.close();
});


router.post('/:idManager/addproject', function(req, res, next){
    var projname = req.body.projectname;
    var sop = req.body.startofproduction;
    var projectdescription = req.body.projectdescription;
    var parentId = req.params.nodeId;
    var projectId = req.params.projectId;


    console.log('All data: ' + JSON.stringify(req.body));
    console.log('pname: ' + projname);
    /*
    var db = new sqlite3.Database('./Volvo.db');

    db.run('INSERT INTO Node (idParentNode, idProject, idResponsible, idNodeType, NodeDescription) VALUES (?,?,?,?,?)', [parentId, projectId, 55, 3, nodeDescription], function(err){
        if (err){
            console.log(nodeDescription + " " + nodeType + " " + nodeManager + " " + parentId + " " + projectId);
            console.log("error in node.js");
            return console.log(err.message);
        } else {
            console.log('A row has been inserted with rowid ${this.lastID}');
        }
    });

    db.close();

    res.redirect('/node/' + parentId);
    */
});



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
        console.log("errrr: "+ pname + " " + pdescription + " " + calcdeadline + " " + sop);
        console.log("error in node.js");
        return console.log(err.message);
    } else {
        console.log('A row has been inserted with rowid ${this.lastID}');
      }
    });

    db.close();



    res.redirect('/');


});


module.exports = router;
