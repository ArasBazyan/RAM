var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adminview');
});

/*router.get('/node', function(req, res, next) {
  res.render('nodeAdmin');
});*/


module.exports = router;
