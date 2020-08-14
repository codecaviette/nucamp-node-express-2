// This is an Express router for campsites and campsitesId. This module will contain the code for handling the REST API endpoints for campsites and campsites/campsiteId

const express = require('express');
const bodyParser = require('body-parser');
const Campsite = require('../models/campsite');             // Import campsite.js file

// Create a new Express router by calling express.Router fxn and assigning it to a variable
const campsiteRouter = express.Router();

campsiteRouter.use(bodyParser.json());

// Add support for 4 endpoints for requests made to /campsites (PLURAL) path on MongoDB server
campsiteRouter.route('/')                                   // The path isn't '/campsites' like you'd expect bc it's defined in server.js on campsiteRouter line - it's located in server.js so server knows where to go                                                    
.get((req, res, next) => {                                  // If we get a request to this endpoint, it means the HTTP Client (ex web browser) is asking to send back data for all of the camnpsites 
    Campsite.find()                                         // This is a static method avail via Campsite Model that will query DB for all docs that were instantiated using Campsite Model
    .then(campsites => {                                    // Use the .then method to access the result from the .find method as "campsites"; once we have that result, we'll set the  following HTTP response settings: 
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsites);                                // This will send JSON data to client in response stream and auto close the response stream afterward so we can remove the res.end mthod from thsi block
    })
    .catch(err => next(err));                               // The "next" fxn passed as a param to the .get method is used to handle any errors; it passes errors to be handled by Express's built-in next method 
})
.post((req, res, next) => {
    Campsite.create(req.body)                               // Campsite.create method creates a new campsite document and saves to MongoDB server. The req.body arg shoudl include the data from client in the HTTP request object/stream. Mongoose will auto verify thsi data fits our Schema we defined, so we don't need to worry about that
    .then(campsite => {                                     // If this request is successful, then it will create a new campsite document
        console.log('Campsite Created ', campsite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})
.delete((req, res, next) => {
    Campsite.deleteMany()                                     // This will delete all campsite documents in the db on MongoDB server
    .then(response => {                                       // The response will be a list of all deleted documents
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

// Add support for 4 endpoints for requests made to /campsites/:campsiteId (SINGULAR) path on MongoDB server
campsiteRouter.route('/:campsiteId')
.get((req, res, next) => {
    Campsite.findById(req.params.campsiteId)                            // .findById method from Mongoose; req.params.campsiteId parses out the campsite ID from the request that was sent from HTTP client (ex. whatever ID user entered into website)
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})
.put((req, res, next) => {
    Campsite.findByIdAndUpdate(req.params.campsiteId, {
        $set: req.body
    }, { new: true })
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


// Export router so it can be used elsewhere in app
module.exports = campsiteRouter;
