
let DataTypes = require('sequelize')
let db = require('../config/db');

const cart = db.define('tbl_cart',{
        id: {
            type : DataTypes.INTEGER,
            autoIncerment:true,primaryKey:true
        },
        prdtid:{type:DataTypes.STRING},
        sellerid:{type: DataTypes.STRING},
        qty:{type: DataTypes.INTEGER},
        userid:{type: DataTypes.STRING}
    
    })
module.exports= cart;