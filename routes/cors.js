// This is the cors module

const cors = require('cors');               // Importing cors npm module (you know bc there's no path (./) infront of 'cors' )

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];    // This says what urls are allowed to access server resources
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));                                    // We're looking at the 'Origin' property of url header 
    if(whitelist.indexOf(req.header('Origin')) !== -1) {                  // indexOf will return -1 if item is not found; This line is checking to see if the origin CAN be found in the whitelist.
        corsOptions = { origin: true };                                   // If it is, we'll allow request to be accepted (via origin: true)
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();                                      // Exports cors that we imported from npm module
exports.corsWithOptions = cors(corsOptionsDelegate);        // Exports the filter we set up above