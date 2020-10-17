let mongoose = require('mongoose');

let registerSchema = mongoose.Schema({
    firstname: String,
    lastname : String,
    email: String,
    userid : String,
    password: String,
    home : String,
    street : String,
    phone : Number,
    state:String,
    city: String,
    pin : Number,
    po : String,
    gender : String,
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