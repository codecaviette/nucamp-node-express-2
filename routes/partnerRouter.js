// This is the Express router for /partners and /partners/:partnerId

const express = require('express');                 // Import needed node modules
const bodyParser = require('body-parser');

const partnerRouter = express.Router();             // Practically-speaking, it's better to use partnersRouter rather than singular

partnerRouter.use(bodyParser.json());               // To use JSON data, you need to be able to parse it, and you can do that using JSON body-parser

// Add support for 4 endpoints for /partner path:
partnerRouter.route("/")
.all((req, res, next) => {                          // When starting line, just entering "." VS code will show you suggestions on commonly-used code there
    res.statusCode = 200;                           // Even though req isn't used in this block, we still need it because method expects SOMETHING in that spot
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res) => {
    res.end("Will send all partners to you");
})
.post((req, res) => {
    res.end(`Will add the partners: ${req.body.name} and description: ${req.body.description} `);          // Info being sent is a request that is an object which has a property that is also an object called body, which has properties of name and description
})
.put((req, res) => {
    res.statusCode = 403;                                                           // Bc we're working with ALL partners here, we do not want to allow updates since it would affect ALL partners rather than 1 which we'll do in the code below with /partnerId
    res.end("PUT operation not supported on /partners endpoint");                   // Important for troubleshooting to include details about path/endpoint that is not being supported 
})
.delete((req, res) => {
    res.end("Deleting all partners");
});


// Add support for 4 endpoints for /partners/:partnerId path:
partnerRouter.route("/:partnerId")
.all((req, res, next) => {                          // When starting line, just entering "." VS code will show you suggestions on commonly-used code there
    res.statusCode = 200;                           // Even though req isn't used in this block, we still need it because method expects SOMETHING in that spot
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res) => {
    res.end(`Will send ${req.params.partnerId} partner to you`)         // params is the route param of url
})
.post((req, res) => {
    res.statusCode = 403;                                                   // This is coder's choice; could've handled differently by allowing a post/create
    res.end("POST operation not supported on :partnerId endpoint")          
})
.put((req, res) => {
    res.write(`Updating partner ${req.params.partnerId}`);              // Here, we're only updating one partner so as the coder, I'm choosing to allow this (vs partners endpoints above)
    res.end(`Will update ${req.body.name} with the description ${req.body.description}`)
})
.delete((req, res) => {
    res.end("Deleting this partner")
});


//Export this router to be used elsewhere in app
module.exports = partnerRouter;