var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);           // Need these two arguments to use the file store

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
//app.use(cookieParser('12345-67890-09876-54321'));                 // We "use" the imported cookie parser tool with a signed/encrypted cookie by providing it an argument which is a secret key (ie, a random number) 
                                                                    // Cannot use cookie parser and Express sessions together bc Express has its own cookie tool
app.use(session({                                                   // Bring in and use session middleware
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,                                       // When a new session is created but no updates are made to it, then at the end of the request it won't get saved bc it's an empty session - thsi prevents creation of empty sessions. 
  resave: false,                                                  // Resave means that once a session is created, updated, and saved, it will continue to be saved even if no changes are made 
  store: new FileStore()                                          // This creates a new FileStore as an object that we can use to save our session info to the server's hard disk instaed of just the running app's memory
}));

// Set up authorization to check for session
function auth(req, res, next) {
  console.log(req.session);                                 // The session middleware will automatically add a property called "session" to request object - logging this shows us what we have access to

  if (!req.session.user) {                                  // If there's NO session. 
      const authHeader = req.headers.authorization;               
      if (!authHeader) {
          const err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
      }

      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const user = auth[0];
      const pass = auth[1];
      if (user === 'admin' && pass === 'password') {              // If user enters 'admin' and 'password' in username/password fields, then a cookie will be created by server for client.
          req.session.use = 'admin';                              // Save to the session that the username is 'admin'
          return next(); // authorized
      } else {
          const err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
      }
  } else {
      if (req.session.user === 'admin') {                   // If there IS a session that is 'admin'
          return next();
      } else {
          const err = new Error('You are not authenticated!');
          err.status = 401;
          return next(err);
      }
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
