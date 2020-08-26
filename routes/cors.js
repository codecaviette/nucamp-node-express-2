// This is the cors module

const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {                  // indexOf will return -1 if item is not found; This line is checking to see if the origin can be found in the whitelist.
        corsOptions = { origin: true };                                   // If it is, we'll allow request to be accepted (via origin: true)
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);