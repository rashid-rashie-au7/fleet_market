let DataTypes = require('sequelize')
let db = require('../config/db');

    const Seller = db.define('tbl_seller',{
        id: {
            type : DataTypes.INTEGER,
            autoIncerment:true
        },
        sellerid:{
            type: DataTypes.STRING,
            primaryKey:true
        },
        fname:{type: DataTypes.STRING},
        lname:{type: DataTypes.STRING},
        email:{type: DataTypes.STRING},
        mobile:{type: DataTypes.INTEGER},
        shop:{type: DataTypes.STRING},
        street:{type: DataTypes.STRING},
        state:{type: DataTypes.STRING},
        city:{type: DataTypes.STRING},
        gender:{type: DataTypes.INTEGER},
        po:{type: DataTypes.STRING},
        pin:{type: DataTypes.INTEGER},
        gstno:{type: DataTypes.STRING},
        password:{type: DataTypes.STRING},
        verified:{type: DataTypes.INTEGER,
                defaultValue:0 }

    })
module.exports= Seller;