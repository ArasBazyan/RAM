var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('projectDetail');
});





// Route to AdminView, based on Person. Maybe idManager?
router.get('/:id', function(req, res, next) {
    var db = new sqlite3.Database('./Volvo.db');
    var iddata;
    var teamData;
    var lock = 2;
    db.serialize(function() {
        db.each("SELECT * FROM Project where idProject = " + req.params.id , (err, rows)=>{
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



        db.all("SELECT DISTINCT OrganizationName from Organization JOIN Person ON Person.idOrganization=Organization.idOrganization WHERE Person.idPerson IN  (SELECT DISTINCT idResponsible FROM Node WHERE idProject= " + req.params.id + ")" , (err, rows)=>{
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


        var sendData = function(){
            console.log('\n EGG2 ' + JSON.stringify(iddata));
            console.log('\n BEANS2 ' + JSON.stringify(teamData));
            res.render('projectDetail', {
                output: req.params.id,
                data: iddata,
                teamData: teamData
            });
        }


    });


    db.close();
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
