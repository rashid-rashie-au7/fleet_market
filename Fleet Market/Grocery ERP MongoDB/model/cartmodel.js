let mongoose = require('mongoose');

let cartSchema = mongoose.Schema({
    prdtid: String,
    sellerid :String,
    userid :String,
    qty : Number,
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("cart",cartSchema);