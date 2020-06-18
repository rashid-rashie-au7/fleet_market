let mongoose = require('mongoose');

let PrdtSchema = mongoose.Schema({
    prdtid: String,
    prdtname : String,
    descn: String,
    price : Number,
    offer: Number,
    catgy:String,
    qty: Number,
    expdate : Date,
    imgpath : String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("prdts",PrdtSchema);