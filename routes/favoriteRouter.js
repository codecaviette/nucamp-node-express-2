
const express = require('express');
const Favorite = require('../models/favorite');             // Import favorite.js file
const authenticate = require('../authenticate');
const cors = require('./cors');                             // This will import the cors module that we created in routes folder (important to include ./ )

// Create a new Express router by calling express.Router fxn and assigning it to a variable
const favoriteRouter = express.Router();


// Add support for 4 endpoints for requests made to /favorites (PLURAL) path on MongoDB server
favoriteRouter
.route('/')                                                         // The path isn't '/favorites' like you'd expect bc it's defined in server.js on campsiteRouter line - it's located in server.js so server knows where to go                                                    
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))   // Deals with pre-flight requests
.get(cors.cors, (req, res, next) => {                               // If we get a GET request to this endpoint, it means the HTTP Client (ex web browser) is asking to send back data for all of the favorites, so we will then call the Favorite.find method to pull all favorites docs and do the following code...
    Favorite.find()                                                 // Favorite.find is a static method avail via Favorite Model (Favorite) and Mongoose (.find) that will query DB for all docs that were instantiated using Favorite Model
    .populate('user')
    .populate('campsites')
    .then(favorite => {                                             // Use the .then method to access the result from the .find method as "favorite"; once we have that result, we'll set the following HTTP response settings: 
        res.statusCode = 200;                                       // "favorite" in .then method can be any word bc its only specific to this local .then fxn, just needs to match whatever is in res.json fxn below
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);                                         // IMPORTANT: This will send JSON data to client in response stream and auto close the response stream afterward so we can remove the res.end mthod from thsi block
    })
    .catch(err => next(err));                                       // The "next" fxn passed as a param to the .get method is used to handle any errors; it passes errors to be handled by Express's built-in next method 
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorites) => {      // Once we find a matching user then do the following:
        if (favorites) {
            req.body.forEach(i => {                                     // Iterate through user's favorites and if favorite is new then push/add new favorite
                if (!favorites.campsites.includes(i._id)) {
                    favorites.campsites.push(i._id);
                }
            });
            favorites
                .save()                                           // might not be necesssary with new versions of mongoose
                .then(favorites => {                                             
                    console.log('Favorites Updated ', favorites);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                })
                .catch(err => next(err));

        } else {
            Favorite.create({user: req.user._id, campsites: req.body })                                       
            .then(favorites => {                                             
                console.log('Favorite Created ', favorites);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
        }
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {                                
    Favorite.findOne({ user: req.user._id })                              
        .then(favorites => {   
            favorites.remove();         // remove all of the favorites for the user                                      
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        })
        .catch(err => next(err));
});


// Add support for 4 endpoints for requests made to /favorites/:campsiteId (SINGULAR) path on MongoDB server
favoriteRouter
.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))       // Deals with pre-flight requests
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on a campsiteId of a favorite');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
        //once we find a matching user then do the following:
        if (favorite) {
            if (!favorite.campsites.includes(req.params.campsiteId)) {
                //push new campsite as a favorite
                favorite.campsites.push(req.params.campsiteId); //this is actually pushing the id into the database right here
                favorite
                    .save() //might not be necessary with new versions of mongoose
                    .then((favorite) => {
                        console.log("Favorites Updated ", favorite);
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(favorite);
                    })
            .catch((err) => next(err));
            } else {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end("That campsite is already in the list of favorites!"); //res.end returns at this point
            }
        } else {
            Favorite.create({ user: req.user._id, campsites: req.params.campsiteId })
            .then((favorite) => {
                console.log("Favorites Created ", favorite);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch((err) => next(err));
        }
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on a campsiteId of a favorite');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id })             // Find user
    .then(favorite => {
        if (favorite) {                                 // if a favorites list exists, then splice/cut it out
            const index = favorite.campsites.indexOf(req.params.campsiteId);
            if (index >= 0) {                                      
                favorite.campsites.splice(index, 1);
            }
            favorite.save()
            .then(favorite => {
                Favorite.findById(favorite._id)
                .then(favorite => {
                    console.log('Favorite Campsite Deleted!', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            }).catch(err => next(err));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }
    }).catch(err => next(err))
});










// Export all the above routes through (everything at /favorites route) router so it can be used elsewhere in app
module.exports = favoriteRouter;