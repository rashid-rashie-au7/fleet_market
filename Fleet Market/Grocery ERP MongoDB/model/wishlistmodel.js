let mongoose = require('mongoose');

let wishlistSchema = mongoose.Schema({
    prdtid: String,
    userid :String,
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("wishlist",wishlistSchema);