var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('calculationView');
});

router.get('/:id', function(req, res, next) {
    var db = new sqlite3.Database('./Volvo.db');
    db.serialize(function() {
        db.each("SELECT * FROM Person where idPerson = " + req.params.id , (err, rows)=>{
            if (err){
                console.error(err);
            } else {
                console.log('\n Cheese' + JSON.stringify(rows));
                res.render('calculationView', {
                    output: req.params.id,
                    data: rows
                });

            }
        });
    });
    db.close();
});

router.get('/table/:idManager', function(req, res, next) {
  var db = new sqlite3.Database('./Volvo.db');
    db.serialize(function() {

    //res.render(projectDetail.html);
// Query
    db.all("SELECT Project.ProjectName, Node.idNode, Node.Version, Node.dateStart, Node.dateEnd, Node.Completed, Node.Archived FROM Project "
         + "INNER JOIN Node ON Project.idProject = Node.idProject "
         + "INNER JOIN Person ON Node.idResponsible = Person.idPerson "
         + "WHERE Node.idResponsible = ?", [req.params.idManager] ,    function(err, rows) {
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
                res.status(200);

               console.log("got ittt  " + JSON.stringify(rows));

                res.json(rows);
            }
        }
        //res.end();
    });
     });
    db.close();
});

module.exports = router;
