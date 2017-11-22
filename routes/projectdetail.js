var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('projectDetail');
});

router.get('/:id', function(req, res, next) {
  var db = new sqlite3.Database('./Volvo.db');
  db.serialize(function() {
        db.each("SELECT * FROM Project where idProject = " + req.params.id , (err, rows)=>{
            if (err){
                console.error(err);
                //res.json("Error " : err);
            } else {
                console.log('\n ÄGG' + JSON.stringify(rows));
                res.render('projectDetail', {
                    output: req.params.id,
                    data: rows
                });

            }
        });
    });
    db.close();
});

module.exports = router;
