// In this file, we create the Mongoose Schema/Model for all user documents in the Users collection on the DB 

const mongoose = require('mongoose');
const Schema = mongoose.Schema;                 

// Create new Schema for user
const userSchema = new Schema({
    username: {                         // Here, the 3 properties of the object (user,pass,admin) are defining the fields in all new user docs
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false                  // When a new user doc is created, the admin flag will be set to false
    }
});

// Export the Model from the module
module.exports = mongoose.model('User', userSchema);            // 1st arg must be SINGULAR version of whatever you want the collection name to be; Mongoose will know to name the collection the PLURAL Users
                                                                // 2nd arg is the schema to use for this mdoel, which is userSchema defined in this file above
