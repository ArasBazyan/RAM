var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('projectDetail');
});





// Route to AdminView, based on Person. Maybe idManager?
router.get('/:idPerson/:idProject', function(req, res, next) {
    var db = new sqlite3.Database('./Volvo.db');
    var iddata;
    var teamData;
    var nodeData;
    var lock = 4;


    var idProject = req.params.idProject;
    var idPerson = req.params.idPerson;


    db.serialize(function() {
        db.each("SELECT * FROM Project where idProject = " + idProject , (err, rows)=>{
            if (err){
                console.error(err);
            } else {
                iddata = rows;
                lock -= 1;



                console.log('\n iddata:  ' + JSON.stringify(iddata));

            }

            if(lock === 0){
                sendData();
            }

        });



        db.all("SELECT DISTINCT OrganizationName from Organization JOIN Person ON Person.idOrganization=Organization.idOrganization WHERE Person.idPerson IN  (SELECT DISTINCT idResponsible FROM Node WHERE idProject= " + idProject + ")" , (err, rows)=>{
            if (err){
                console.error(err);
            } else {
                teamData = rows;
                lock -= 1;


                console.log('\n teamData: ' + JSON.stringify(teamData));


            }

            if(lock === 0){
                sendData();
            }

        });

        db.all("SELECT * FROM Node where idProject = " + idProject + " AND idParentNode = " + 0, (err, rows)=>{
            if (err){
                console.error(err);
            } else {
                if (JSON.stringify(rows).length > 0){
                    nodeData = rows;
                    lock -= 1;
                } else {
                    nodeData = 0;
                    lock -= 1;
                }
            }

            if(lock === 0){
                sendData();
            }
        });


        db.all("SELECT idPerson FROM Person where idPerson = " + idPerson, (err, rows)=>{
            if (err){
                console.error(err);
            } else {
                if (JSON.stringify(rows).length > 0){
                    //nodeData = rows;
                    lock -= 1;
                } else {
                   // nodeData = 0;
                    lock -= 1;
                }
            }

            if(lock === 0){
                sendData();
            }
        });



        var sendData = function(){
            console.log('\n EGG2 ' + JSON.stringify(iddata));
            console.log('\n BEANS2 ' + JSON.stringify(teamData));
            console.log('\n BACON2 ' + JSON.stringify(nodeData));
            res.render('projectDetail', {
                personID : idPerson,
                projectID: idProject,
                data: iddata,
                teamData: teamData,
                nodeData: nodeData
            });
        }


    });


    db.close();
});


router.post('/:id/addchild', function(req, res, next){
    var nodeName = req.body.inputNodeName;
    var nodeDescription = req.body.inputNodeDesc;
    var nodeType = req.body.inputNodeType;
    var nodeManager = req.body.inputManagerNode;
    var projectId = req.params.id;

    var db = new sqlite3.Database('./Volvo.db');

    db.run('INSERT INTO Node (idParentNode, idProject, idResponsible, idNodeType, NodeDescription, Comments) VALUES (?,?,?,?,?,?)', [0, projectId, 55, 3, nodeDescription, nodeName], function(err){
        if (err){
            console.log(nodeDescription + " " + nodeType + " " + nodeManager + " " + parentId + " " + projectId);
            console.log("error in node.js");
            return console.log(err.message);
        } else {
            console.log('A row has been inserted');
        }
    });

    db.close();

    res.redirect('/projectDetail/' + req.params.id);
});

/*
router.get('/:id', function(req, res, next) {
  var db = new sqlite3.Database('./Volvo.db');
  db.serialize(function() {
        db.each("SELECT * FROM Project where idProject = " + req.params.id , (err, rows)=>{
            if (err){
                console.error(err);
                //res.json("Error " : err);
            } else {
                console.log('\n Pizza' + JSON.stringify(rows));
                res.render('projectDetail', {
                    output: req.params.id,
                    data: rows
                });

            }
        });
    });
    db.close();
});
*/
module.exports = router;
