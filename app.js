var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');          // Created by Express Generator
var usersRouter = require('./routes/users');          // Created by Express Generator
const campsiteRouter = require('./routes/campsiteRouter');        // Importing file-based modules/routers with keyword "require"
const promotionRouter = require('./routes/promotionRouter');      // Importing file-based modules/routers with keyword "require"
const partnerRouter = require('./routes/partnerRouter');          // Importing file-based modules/routers with keyword "require"

// Connect this Express app to the MongoDB server thru Mongoose wrapper methods around MongoDB Node Driver 
const mongoose = require('mongoose');                  // Require Mongoose module
const url = 'mongodb://localhost:27017/nucampsite';    // url for MongoDB server
const connect = mongoose.connect(url, {                // Set up connection. The connect method returns a Promise, so we can use .then and .catch to handle that.
  useCreateIndex: true, 
  useFindAndModify: true,
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'),          // If Express app is able to connect to the MongoDB server, then it will log this msg. 
  err => console.log(err)                                                 // otherwise it will give an error message. Instead of using the .catch method for this, you can instead insert the error handling as a second argument to .then method
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use is an Express middleware fxn that allows the app to use modules, whether they're core modules, file-based, or 3rd party
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up authentication BEFORE static prop of express, so users must authenticate BEFORE they can access static data on server; otherwise, any user coulc access and update server data
function auth(req, res, next) {                           // Define an Express Middleware function called "auth" which requires params: req, res, and (optional) next  
  console.log(req.headers);                               // This will allow us to see what's in the request object's authorization header
  const authHeader = req.headers.authorization;           // Grab just the authorization header out of the request headers and assign it to constant authHeader
  if (!authHeader){                                       // If authHeader is null, this means we did not get any auth info in this request, so the user hasn't entered a username/password yet
    const err = new Error('You are not authenticated');        // If no authHeader, then we'll throw an error message 
    res.setHeader('WWW-Authenticate', 'Basic');                // then send a response header: 1st arg: Lets client know app is requesting authentication; 2nd arg: method being requested is basic
    err.status = 401;                                          // Standard error status code for auth issues
        return next(err);                                           // Pass error message to Express to handle sending the error message and auth request back to client
    }
    
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');         // When there IS an authorization header, we can go here. Here, we'll parse the auth header and validate the username and password by making them the 1st and 2nd value in a new array
    const user = auth[0];                                                                       // username is the 1st position of the auth array 
    const pass = auth[1];                                                                       // password is the 2nd position of the auth array 
    if (user === 'admin' && pass === 'password') {
        return next(); // authorized                                                            // If the above is true, we're authorized!
    } else {
        const err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');      
        err.status = 401;
        return next(err);
    }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);                // The index router has a filepath of '/' 
app.use('/users', usersRouter);
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
