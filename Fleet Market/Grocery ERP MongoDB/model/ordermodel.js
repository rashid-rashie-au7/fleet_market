let mongoose = require('mongoose');

let orderSchema = mongoose.Schema({
    oid: String,
    prdtid: String,
    sellerid :String,
    userid : String,
    prdtname : String,
    price : Number,
    offer: Number,
    qty: Number,
    total : Number,
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("order",orderSchema);