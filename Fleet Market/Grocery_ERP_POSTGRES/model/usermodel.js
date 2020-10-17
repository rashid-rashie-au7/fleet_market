let DataTypes = require('sequelize')
let db = require('../config/db');

    const user = db.define('tbl_user',{
        id: {
            type : DataTypes.INTEGER,
            autoIncerment:true
        },
        userid:{
            type: DataTypes.STRING,
            primaryKey:true
        },
        fname:{type: DataTypes.STRING},
        lname:{type: DataTypes.STRING},
        email:{type: DataTypes.STRING},
        mob:{type: DataTypes.INTEGER},
        home:{type: DataTypes.STRING},
        street:{type: DataTypes.STRING},
        state:{type: DataTypes.STRING},
        city:{type: DataTypes.STRING},
        gender:{type: DataTypes.INTEGER},
        po:{type: DataTypes.STRING},
        pin:{type: DataTypes.INTEGER},
        password:{type: DataTypes.STRING},
        verified:{type: DataTypes.INTEGER,
                defaultValue:0 }

    })
module.exports= user;