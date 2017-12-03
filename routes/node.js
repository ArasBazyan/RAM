var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('nodeAdmin');
});

router.get('/:id', function(req, res, next) {
  var jsonTest = JSON.parse('{"cost": "Something nice", "costType": "Test1", "value": 700, "Status": "Done"}');
  //{"cost": "This cool thing", "costType": "Type 5", "value": 900, "Status": "In Progress"}
  //var jsonTest = JSON.parse(variable);
  var db = new sqlite3.Database('./Volvo.db');
  var lock = 5;
  var idParentNode;
  var nodeData;
  var childData;
  var levelData;
  var nodeCosts;
  var childNodeCosts;

  db.serialize(function() {
        db.each("SELECT idNode, idProject, idParentNode, NodeDescription FROM Node where idNode = " + req.params.id , (err, rows)=>{
            if (err){
                console.error(err);
                //res.json("Error " : err);
            } else {
                nodeData = rows;
                idParentNode = rows.idParentNode;
                console.log("MARMITE " + idParentNode);
                lock -= 1;
                //console.log('\n TOAST' + JSON.stringify(jsonTest));         
            }

            if(lock === 1){
                getLevelNodes();
            }
        });

        db.all("SELECT idNode, idProject FROM Node where idParentNode = " + req.params.id, (err, rows)=>{
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

        db.all("Select resources.resourceName, resourceType.resourceType, PersonNodeResource.Cost, PersonNodeResource.Comments from PersonNodeResource join resources on PersonNodeResource.idResource=resources.idResource join resourceType on resources.idResourceType=resourceType.idResourceType where PersonNodeResource.idnode= " + req.params.id, (err, rows) =>{
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

        db.all("Select Node.idNode, resources.resourceName, resourceType.resourceType, PersonNodeResource.Cost, PersonNodeResource.Comments from PersonNodeResource join resources on PersonNodeResource.idResource=resources.idResource join resourceType on resources.idResourceType=resourceType.idResourceType join Node on Node.idNode = PersonNodeResource.idNode where Node.idParentNode= " + req.params.id, (err, rows) =>{
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

        function getLevelNodes(){
            console.log("in getLevelNodes");
            db.all("SELECT idNode FROM Node where idParentNode = " + idParentNode + " AND idNode != " + req.params.id, (err, rows)=>{
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
            console.log('EGG2 ' + JSON.stringify(nodeData));
            console.log('BEANS2 ' + JSON.stringify(childData));
            console.log('TOAST2' + JSON.stringify(levelData));
            console.log('SAUSAGES2' + JSON.stringify(nodeCosts));
            console.log('TOMATOES2' + JSON.stringify(childNodeCosts));
            res.render('nodeAdmin', {
                output: req.params.id,
                data: nodeData,
                childNodes: childData,
                levelNodes: levelData,
                nodeCosts: nodeCosts,
                childNodeCosts: childNodeCosts
            });
            db.close();
        }
    });
    
});

router.post('/:projectId/:nodeId/addchild', function(req, res, next){
    var nodeDescription = req.body.inputNodeDesc;
    var nodeType = req.body.inputNodeType;
    var nodeManager = req.body.inputManagerNode;
    var parentId = req.params.nodeId;
    var projectId = req.params.projectId;

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
});


module.exports = router;
