let DataTypes = require('sequelize')
let db = require('../config/db');

const wishlist = db.define('tbl_wishlist',{
    id: {
        type : DataTypes.INTEGER,
        autoIncerment:true,
        primaryKey:true,
        
    },
    prdtid:{type: DataTypes.STRING},
    userid:{type: DataTypes.STRING}
})
module.exports= wishlist;
