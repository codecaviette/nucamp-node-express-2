
const mongoose = require('mongoose');                   
const Schema = mongoose.Schema;

// Create Favorite Schema
const favoriteSchema = new Schema (
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",                                    // Referencing User Model exported from user.js file
        },
        campsites: [{                                       // campsites will be an array of campsites. this allows a single user to post multiple campsites as favorites
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campsite",
        }]
    }, {
        timestamps: true                                    // Best practice to have timestamps
    }
);

// Create Model from Schema defined above
const Favorite = mongoose.model('Favorite', favoriteSchema)                

// Export this Favorite module
module.exports = Favorite;                