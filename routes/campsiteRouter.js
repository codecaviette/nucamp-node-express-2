// This is an Express router for campsites and campsitesId. This module will contain the code for handling the REST API endpoints for campsites and campsites/campsiteId

const express = require('express');
const bodyParser = require('body-parser');

// Create a new Express router by calling express.Router fxn and assigning it to a variable
const campsiteRouter = express.Router();

campsiteRouter.use(bodyParser.json());

// Add support for 4 endpoints for requests to /campsites:
campsiteRouter.route('/')                           // The path isn't '/campsites' like you'd expect bc it's defined in server.js on campsiteRouter line - it's located in server.js so server knows where to go
                                                    // When moving Express routing methods out of single file and into a separate module, we'll now link the methods by removing "app" from "app.all" method, removing path '/campsites' from param list since it's now defined in server.js, and remove ; at end of block so methods are linked 
.all((req, res, next) => {                          // It is best practice/standard with Node to link methods starting with .all (which will not explicitly be called, like .get, but is included when .get is called); Linking methods like this is for efficiency's sake. The request and response objects/streams are required; next is optional. 
    res.statusCode = 200;                                  
    res.setHeader('Content-type', 'text/plain');    // setHeader tells server what type of content we're sending to server, which in this case is text/plain
    next();                                                
})

.get((req, res) => {                                // .get is reading data in database
    res.end(`Will send all the campsites to you`);         
})

.post((req, res) => {                                                                                       // .post is creating/adding data to database
    res.end(`Will add the campsites: ${req.body.name} with description: ${req.body.description}`);          // Request object being sent has a body that has properties name and description 
})

.put((req, res) => {                                                // .put is updating data in database
    res.statusCode = 403;                                           // This status code overrides what's defined above in .all 
    res.end(`PUT operation not supported on /campsites`);
})

.delete((req, res) => {
    res.end(`Deleting all campsites`);
});                                                                 // Leave this semicolon since it's the end of the routing method statement


// Add support for 4 endpoints for requests to /campsites/:campsiteId
campsiteRouter.route('/:campsiteId')                           
.all((req, res, next) => {                          
    res.statusCode = 200;                                  
    res.setHeader('Content-type', 'text/plain');    
    next();                                                
})
.get((req, res) => {                      
    res.end(`Will send details of the campsite: ${req.params.campsiteId} to you`);          // req.params.campsiteId: req is the req obj/stream, params is coming from built-in route params of the url, campsiteId is the property of the route params property
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})
.put((req, res) => {
    res.write(`Updating the campsite: ${req.params.campsiteId}\n`);                                    // \n creates new line
    res.end(`Will update the campsite: ${req.body.name} with description ${req.body.description}`);    // We're parsing out the body name and body description from the request object that was sent to us, rather than the campsite ID route paramater (like in the above)  
})
.delete((req, res) => {
    res.end(`Deleting campsite: ${req.params.campsiteId}`);                                 // This will only delete the selected campsite, rather than all of them as stated in the above delete method
});               


// Export router so it can be used elsewhere in app
module.exports = campsiteRouter;
