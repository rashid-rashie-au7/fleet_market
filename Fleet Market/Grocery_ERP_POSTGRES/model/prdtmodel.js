let DataTypes = require('sequelize')
let db = require('../config/db');

    const prdt = db.define('tbl_prdt',{
        id: {
            type : DataTypes.INTEGER,
            autoIncerment:true
        },
        prdtid:{
            type: DataTypes.STRING,
            primaryKey:true
        },
        prdtname:{type: DataTypes.STRING},
        descn:{type: DataTypes.STRING},
        brand:{type: DataTypes.STRING},
        category:{type: DataTypes.STRING},
        price:{type: DataTypes.DOUBLE},
        offerper:{type: DataTypes.INTEGER},
        offer:{type: DataTypes.DOUBLE },
        qty : {type:DataTypes.INTEGER},
        sellerid:{type: DataTypes.STRING},
        life:{type: DataTypes.STRING},
        imgpath:{type: DataTypes.STRING}
    })
module.exports= prdt;