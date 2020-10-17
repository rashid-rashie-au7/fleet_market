let mongoose = require('mongoose');

let PrdtSchema = mongoose.Schema({
    prdtid: String,
    sellerid :String,
    prdtname : String,
    descn: String,
    price : Number,
    brand : String,
    offer: Number,
    catgy:String,
    qty: Number,
    life : String, 
    imgpath : String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("prdts",PrdtSchema);