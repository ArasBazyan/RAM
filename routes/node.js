var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var qs = require('qs');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('nodeAdmin');
});

router.get('/:idPerson/:idNode', function(req, res, next) {
  var jsonTest = JSON.parse('{"cost": "Something nice", "costType": "Test1", "value": 700, "Status": "Done"}');
  //{"cost": "This cool thing", "costType": "Type 5", "value": 900, "Status": "In Progress"}
  //var jsonTest = JSON.parse(variable);
  var db = new sqlite3.Database('./Volvo.db');
  var lock = 7;
  var idParentNode;
  var idProject;
  var teamData;
  var nodeData;
  var childData;
  var levelData;
  var nodeCosts;
  var childNodeCosts;
  var resourceTypes;
  var responsibleFlag = false;

  var idNode = req.params.idNode;
  var idPerson = req.params.idPerson; 

  db.serialize(function() {
        db.each("SELECT Node.idNode, Node.idProject, Node.idResponsible, Node.idParentNode, Node.NodeDescription, Node.Comments, Project.ProjectName FROM Node join Project on Node.idProject = Project.idProject where idNode = " + idNode , (err, rows)=>{
            if (err){
                console.error(err);
                //res.json("Error " : err);
            } else {
                nodeData = rows;
                idParentNode = rows.idParentNode;
                idProject = rows.idProject;
                console.log("MARMITE " + idParentNode);

                if(rows.idResponsible == idPerson){
                    responsibleFlag = true;
                }
                lock -= 1;
                //console.log('\n TOAST' + JSON.stringify(jsonTest));         
            }

            if(lock === 1){
                getLevelNodes();
            }
        });

        db.all("SELECT idNode, idProject, Comments FROM Node where idParentNode = " + idNode, (err, rows)=>{
            if (err){
                console.error(err);
            } else {
                if (JSON.stringify(rows).length > 0){
                    childData = rows;
                    lock -= 1;
                } else {
                    childData = 0;
                    lock -= 1;
                }
            }

            if(lock === 1){
                getLevelNodes();
            }
        });

        db.all("Select resources.resourceName, resourceType.resourceType, PersonNodeResource.Cost, PersonNodeResource.Comments from PersonNodeResource join resources on PersonNodeResource.idResource=resources.idResource join resourceType on resources.idResourceType=resourceType.idResourceType where PersonNodeResource.idnode= " + idNode, (err, rows) =>{
            if (err){
                console.error(err);
            } else {
                if (JSON.stringify(rows).length > 0){
                    nodeCosts = rows;
                    lock -= 1;
                } else {
                    nodeCosts = 0;
                    lock -= 1;
                }

                if(lock === 1){
                    getLevelNodes();
                }
            }
        });

        db.all('Select * from resourceType', (err, rows)=>{
            if (err){
                console.error(err);
            } else {
                resourceTypes = rows;
                lock -=1;
            }
            
            if(lock === 1){
                getLevelNodes();
            }
        });

        db.all("Select Node.idNode, resources.resourceName, resourceType.resourceType, PersonNodeResource.Cost, PersonNodeResource.Comments from PersonNodeResource join resources on PersonNodeResource.idResource=resources.idResource join resourceType on resources.idResourceType=resourceType.idResourceType join Node on Node.idNode = PersonNodeResource.idNode where Node.idParentNode= " + idNode, (err, rows) =>{
            if (err){
                console.error(err);
            } else {
                if (JSON.stringify(rows).length > 0){
                    childNodeCosts = rows;
                    lock -= 1;
                } else {
                    childNodeCosts = 0;
                    lock -= 1;
                }

                if(lock === 1){
                    getLevelNodes();
                }
            }
        });

        db.all("SELECT Organization.idOrganization, Organization.OrganizationName FROM Person  INNER JOIN Organization on Person.idOrganization = Organization.idParentOrganization where Person.idPerson = " + idPerson, (err, rows) => {
            if (err) {
                console.error(err);
            } else {
                teamData = rows;
                lock -= 1;


               // console.log('\n teamData: ' + JSON.stringify(teamData));


            }

            if (lock === 1) {
                getLevelNodes();
            }

        });

        function getLevelNodes(){
            console.log("in getLevelNodes");
            db.all("SELECT idNode, Comments FROM Node where idParentNode = " + idParentNode + " AND idNode != " + idNode + " AND idProject = " + idProject, (err, rows)=>{
                if (err){
                    console.error(err);
                } else {
                    if (JSON.stringify(rows).length > 0){
                        levelData = rows;
                        lock -= 1;
                    } else {
                        levelData = 0;
                        lock -= 1;
                    }
                }
    
                if(lock === 0){
                    sendData();
                }
            });
        }

        var sendData = function(){
            /*console.log('EGG2 ' + JSON.stringify(nodeData));
            console.log('BEANS2 ' + JSON.stringify(childData));
            console.log('TOAST2' + JSON.stringify(levelData));
            console.log('SAUSAGES2' + JSON.stringify(nodeCosts));
            console.log('TOMATOES2' + JSON.stringify(childNodeCosts));
            console.log('BACON2' + JSON.stringify(resourceTypes));
            console.log('POTATOES2 ' + JSON.stringify(teamData));
            console.log('IDPERSON: ' + idPerson);*/
            res.render('nodeAdmin', {
                output: idPerson,
                data: nodeData,
                childNodes: childData,
                levelNodes: levelData,
                nodeCosts: nodeCosts,
                childNodeCosts: childNodeCosts,
                resourceTypes: resourceTypes,
                teamData: teamData,
                responsibleFlag: responsibleFlag
            });
            db.close();
        }
    });
    
});

router.post('/:projectId/:personId/:nodeId/addchild', function(req, res, next){
    //var nodeName = req.body.inputNodeName;
    var nodeDescription = req.body.inputNodeDesc;
    var nodeType = req.body.inputNodeType;
    var nodeManager = req.body.inputManagerNode;
    var parentId = req.params.nodeId;
    var projectId = req.params.projectId;
    var personId = req.params.personId;
    var affected = req.body.selectedTeams;
    //var affected = qs.parse(req.body.selectedTeams);

    var idResponsible;
    var nodeName;

    console.log("AFFECTED TEAAAAMZZZ \n" + JSON.stringify(affected));
    console.log("Affected length: " + affected.length);

    var db = new sqlite3.Database('./Volvo.db');

    for(var i = 0; i<affected.length; i++){


        db.each("SELECT Person.idPerson, Organization.OrganizationName FROM Person JOIN Organization on Person.idOrganization = Organization.idOrganization WHERE Person.Manager = 1 AND Organization.idOrganization =  " + affected[i], (err, rows) => {
            if (err) {
                console.log("errors be comin");
                console.error(err);
            } else{
                idResponsible = rows.idPerson;
                nodeName = rows.OrganizationName;
                console.log("ID RESPONSIBLE FOR NEW NODE: "+idResponsible);
                console.log("NAME FOR NEW NODE: "+nodeName);

                db.run('INSERT INTO Node (idParentNode, idProject, idNodeType, idResponsible, NodeDescription, Comments, Version, Completed, Archived) VALUES (?,?,?,?,?,?,?,?,?)', 
                [parentId, projectId, 3, idResponsible, nodeDescription, nodeName, 1, 0, 0], function(err){
                if (err){
                    console.log(nodeDescription + " " + nodeType + " " + nodeManager + " " + parentId + " " + projectId);
                    console.log("error in node.js");
                    return console.log(err.message);
                } else {
                    console.log(`A new node inserted with id: ${this.lastID}`);
                   // console.log(`A row has been inserted with rowid ${this.lastID}`);
                }
            });
            }
        });


        
    }

    /*db.run('INSERT INTO Node (idParentNode, idProject, idResponsible, idNodeType, NodeDescription, Comments) VALUES (?,?,?,?,?,?)', [parentId, projectId, 55, 3, nodeDescription, nodeName], function(err){
        if (err){
            console.log(nodeDescription + " " + nodeType + " " + nodeManager + " " + parentId + " " + projectId);
            console.log("error in node.js");
            return console.log(err.message);
        } else {
            console.log(`A new node inserted with id: ${this.lastID}`);
           // console.log(`A row has been inserted with rowid ${this.lastID}`);
        }
    });*/

    db.close();

    res.redirect('/node/' + personId + '/' + parentId);
});

router.post('/:personId/:nodeId/addCalculation', function(req, res, next){
    var cost = req.body.inputCost; //goes into resources
    var costType = req.body.inputCostType; //goes into resources
    var value = req.body.inputValue; //goes into personnoderesource
    var status = req.body.inputStatus; //goes into personnoderesource
    var idNode = req.params.nodeId; //goes into personnoderesource
    var personId = req.params.personId;

    var insertedId;
   
    var db = new sqlite3.Database('./Volvo.db');

    db.run('INSERT INTO Resources (idResourceType, ResourceName) VALUES(?,?)', [costType, cost], function(err){
        if (err){
            return console.log(err.message);
        } else {
            insertedId = `${this.lastID}`;
            console.log('New id is: ' + insertedId);
            setPersonNodeResource();
        }
    });

    function setPersonNodeResource(){
        db.run('INSERT INTO PersonNodeResource (idNode, idResource, Cost, Comments) VALUES(?,?,?,?)', [idNode, insertedId, value, status], function(err){
            if (err){
                console.log("error in node.js");
                return console.log(err.message);
            } else {
                console.log(`New idPersonNodeResource is: ${this.lastID}`);
                sendData();
            }
        });
    }

    var sendData = function(){
        db.close();

        res.redirect('/node/' + personId + '/' + idNode);
    }
});


module.exports = router;
