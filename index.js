var express = require('express');
var app = express();
var http = require('http').Server(app);

// register path for static files
var staticFiles = require('./static')(app, express);

// contain methods for interact with users
var users = require('./models/users');
var usersModel = new users();

var io = require('socket.io')(http);
var socketIoModule = require("./io");
var socketIo = new socketIoModule(io, usersModel);

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('view engine', 'pug');
var routes = require('./routes/index')(express, socketIo, usersModel);
app.use('/', routes);

app.use((req, res, next) => {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
	message: err.message,
	error: {}
    });
});
    
http.listen(3000, () => {
    console.log('The application is running');
});