var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

//connect to MongoDB
mongoose.connect('mongodb://localhost/test')
var db = mongoose.connection

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function(){
    //we`re connected
});

//use sessions for tracking logins
app.use(session({
    secret: 'be easy',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

//parse incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
var x = 0;

//statics
app.use('/public', express.static('web'))

//include routes
var routes = require('./routes/router')
app.use('/', routes)

//404 catcher
app.use(function(req, res, next){
    var err = new Error('File Not Found')
    err.status = 404
    next(err)
});

//404 handler
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.send(err.message);
});

//listen on poet 3000
app.listen(3000, function(){
    console.log('Express app listening on port 3000')
});