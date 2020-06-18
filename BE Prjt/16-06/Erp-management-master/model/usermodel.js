let mongoose = require('mongoose');

let registerSchema = mongoose.Schema({
    firstname: String,
    lastname : String,
    email: String,
    userid : String,
    password: String,
    state:String,
    city: String,
    gender : String,
    usertype : String,
    verify: {
        type:Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("user",registerSchema);