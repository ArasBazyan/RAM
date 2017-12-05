var express = require('express');
var router = express.Router();



router.get('/favicon.ico', function(req, res) {
    res.status(204);
});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', {layout: false});
});



module.exports = router;