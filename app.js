var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes');
var users = require('./routes/user');
var restaurants = require('./routes/restaurant');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

//build models
var resturantModel = require('./models/restaurant');
restaurants(resturantModel(mongoose).model);
var userModel = require('./models/user');
users(userModel(mongoose).model);

//set up routes
app.get('/', routes.index);
app.get('/users', users.list);
app.get('/users/:fbId', users.find);
app.get('/restaurants', restaurants.list);
app.get("/restaurants/id/:id", restaurants.list.search);
app.get("/restaurants/name/:name", restaurants.list.search);
app.post('/restaurants', restaurants.save);
app.post('/restaurant/:id/report', restaurants.submitReport);
app.post('users', users.save);

app.configure('development', function() {
    mongoose.connect('mongodb://localhost/9dash');
});

app.configure('production', function() {
    mongoose.connect(process.env.MONGOHQ_URL);
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
