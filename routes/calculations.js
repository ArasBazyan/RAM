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
    db.all("SELECT Project.idProject, Project.ProjectName, Project.Version, Project.dateStart, Project.dateEnd FROM Project "
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
    db.close();
});

module.exports = router;
