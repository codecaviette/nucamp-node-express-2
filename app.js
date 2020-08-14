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
