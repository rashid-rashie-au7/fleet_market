let DataTypes = require('sequelize')
let db = require('../config/db');

const order = db.define('tbl_orders',{
    id: {
        type : DataTypes.INTEGER,
        autoIncerment:true,
        primaryKey:true
    },
    prdtid:{type:DataTypes.STRING},
    prdtname:{type: DataTypes.STRING},
    price:{type: DataTypes.DOUBLE},
    offer:{type: DataTypes.DOUBLE },
    sellerid:{type: DataTypes.STRING},
    qty:{type: DataTypes.INTEGER},
    total:{type: DataTypes.DECIMAL(10,2)},
    userid:{type: DataTypes.STRING}
})
module.exports= order;

