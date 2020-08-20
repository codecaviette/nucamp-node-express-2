// Local Strategy implementation 

const passport = require('passport');                          // Require Passport middleware for local authentication in the server
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));               // User passport.use method to specify which Strategy plugin we want to use in Passport implementation
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

