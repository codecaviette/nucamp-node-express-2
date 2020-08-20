
const express = require('express');
const User = require('../models/user');

const router = express.Router();

// GET users listing
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Add support for new endpoints (HTTP request + filpath)
// This endpoint allows new users to register on website's filepath users/signup by creating new username/password
router.post('/signup', (req, res, next) => {                // Post request. 1st arg: filepath; 2nd arg: middleware callback fxn
  User.findOne({username: req.body.username})               // We'll first check to make sure the db doesn't already have a username the user is trying to register with. Use the static method findOne on the User Model
  .then(user => {
      if (user) {                                           // If user is truthy (ie the username the client entered matches a username already in the db), then they'll be thrown an error message
          const err = new Error(`User ${req.body.username} already exists!`);
          err.status = 403;
          return next(err);                                 // Pass the error to be handled by Express with the next fxn
      } else {                                              // If user variable is falsy (ie. it's null, undefined or something other than our user document), then we'll create a new User document with the user/pass sent by client
          User.create({                                     // .create method creates a Promise so we can use .then method below to handle the resolve value which should be the document added
              username: req.body.username,
              password: req.body.password})
          .then(user => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({status: 'Registration Successful!', user: user});
          })
          .catch(err => next(err));                          // Handles any errors 
      }
  })
  .catch(err => next(err));                                  // Handles any errors if the .findOne method returned a rejected Promise, which wouldn't be that a username exists, it would by a process error, and its passed on to Express error handler
});

// Add support for POST request to users/login filepath
router.post('/login', (req, res, next) => {                  // Post request. 1st arg: filepath; 2nd arg: middleware callback fxn
  if(!req.session.user) {                                    // Props of req.session is auto filled in based on whether the request headers contained a cookie with an existing session ID
      const authHeader = req.headers.authorization;

      if (!authHeader) {
          const err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
      }
    
      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const username = auth[0];
      const password = auth[1];
    
      User.findOne({username: username})
      .then(user => {
          if (!user) {
              const err = new Error(`User ${username} does not exist!`);
              err.status = 401;
              return next(err);
          } else if (user.password !== password) {
              const err = new Error('Your password is incorrect!');
              err.status = 401;
              return next(err);
          } else if (user.username === username && user.password === password) {
              req.session.user = 'authenticated';
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/plain');
              res.end('You are authenticated!')
          }
      })
      .catch(err => next(err));
  } else {                                                        // If there is an existing session ID on server, then...
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated!');
  }
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    const err = new Error('You are not logged in!');
    err.status = 401;
    return next(err);
  }
});

module.exports = router;