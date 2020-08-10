// This is the Express router for /promotions and /promotions/:promotionId

const express = require('express');                 // Import needed node modules
const bodyParser = require('body-parser');

const promotionRouter = express.Router();           // Practically-speaking, it's better to use promotionsRouter rather than singular

promotionRouter.use(bodyParser.json());             // To use JSON data, you need to be able to parse it, and you can do that using JSON body-parser

// Add support for 4 endpoints for /promotion path:
promotionRouter.route("/")
.all((req, res, next) => {                          // When starting line, just entering "." VS code will show you suggestions on commonly-used code there
    res.statusCode = 200;                           // Even though req isn't used in this block, we still need it because method expects SOMETHING in that spot
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res) => {
    res.end("Will send all promotions to you");
})
.post((req, res) => {
    res.end(`Will add the promotions: ${req.body.name} and description: ${req.body.description} `);          // Info being sent is a request that is an object which has a property that is also an object called body, which has properties of name and description
})
.put((req, res) => {
    res.statusCode = 403;                                                           // Bc we're working with ALL promos here, we do not want to allow updates since it would affect ALL promos rather than 1 which we'll do in the code below with /promotionsId
    res.end("PUT operation not supported on /promotion endpoint");                   // Important for troubleshooting to include details about path/endpoint that is not being supported 
})
.delete((req, res) => {
    res.end("Deleting all promotions");
});


// Add support for 4 endpoints for /promotion/:promotionId path:
promotionRouter.route("/:promotionId")
.all((req, res, next) => {                          // When starting line, just entering "." VS code will show you suggestions on commonly-used code there
    res.statusCode = 200;                           // Even though req isn't used in this block, we still need it because method expects SOMETHING in that spot
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res) => {
    res.end(`Will send ${req.params.promotionId} promotion to you`)         // params is the route param of url
})
.post((req, res) => {
    res.statusCode = 403;                                                   // This is coder's choice; could've handled differently by allowing a post/create
    res.end("POST operation not supported on :promotionId endpoint")          
})
.put((req, res) => {
    res.write(`Updating promotion ${req.params.promotionId}`);              // Here, we're only updating one promotion so as the coder, I'm choosing to allow this (vs promotions endpoints above)
    res.end(`Will update ${req.body.name} with the description ${req.body.description}`)
})
.delete((req, res) => {
    res.end("Deleting this promotion")
});


//Export this router to be used elsewhere in app
module.exports = promotionRouter;