var express = require("express");
var app     = express();
var path    = require("path");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');

var login = require('./routes/login');
var index = require('./routes/index');
var node = require('./routes/node');
var projectdetail = require('./routes/projectdetail');
var calculations = require('./routes/calculations');


// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


/* Config (request) and (response) */
 // Body parser use JSON data
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Support for CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,    Content-Type, Accept");
    next();
});


app.use('/', login);
app.use('/admin', index);
app.use('/node', node);
app.use('/projectdetail', projectdetail);
app.use('/calculations', calculations);





app.listen(3000);

console.log("Running at Port 3000");
