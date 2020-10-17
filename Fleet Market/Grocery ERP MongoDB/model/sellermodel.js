let mongoose = require('mongoose');
let registerSchema = mongoose.Schema({
    firstname: String,
    lastname : String,
    email: String,
    sellerid : String,
    password: String,
    gstnumber : String,
    phone : Number,
    shop : String,
    street : String,
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
module.exports = mongoose.model("seller",registerSchema);