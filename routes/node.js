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
  var lock = 2;
  var nodeData;
  var childData;
  db.serialize(function() {
        db.each("SELECT idNode, idProject, NodeDescription FROM Node where idNode = " + req.params.id , (err, rows)=>{
            if (err){
                console.error(err);
                //res.json("Error " : err);
            } else {
                nodeData = rows;
                lock -= 1;
                console.log('\n EGG' + JSON.stringify(nodeData));
                //console.log('\n TOAST' + JSON.stringify(jsonTest));         
            }

            if(lock === 0){
                sendData();
            }
        });

        db.each("SELECT idNode, idProject FROM Node where idParentNode = " + req.params.id, (err, rows)=>{
            if (err){
                console.error(err);
            } else {
                childData = rows;
                lock -= 1;
                console.log('n\ BEANS' + JSON.stringify(childData));
            }

            if(lock === 0){
                sendData();
            }
        });

        var sendData = function(){
            console.log('\n EGG2 ' + JSON.stringify(nodeData));
            console.log('\n BEANS2 ' + JSON.stringify(childData));
            res.render('nodeAdmin', {
                output: req.params.id,
                data: nodeData,
                childNodes: childData 
            });
        }
    });
    db.close();
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
