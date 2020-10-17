let LocalStrategy = require('passport-local').Strategy;
let bcrypt = require('bcrypt');

// Load User model
let Seller = require('../model/sellermodel');
let Buyer = require('../model/usermodel')

module.exports = function(passport) {
    let isSeller 
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            Seller.findOne({where :{'email' : email}}).then(function(user){    
                if(user == null){
                    Buyer.findOne({where :{'email' : email}}).then(function( user) {
                        if (user == null) {
                            return done(null,false,{message: 'Incorrect credintails'})
                        }else{
                            bcrypt.compare(password, user.password, (error, isMatch) => {
                                if (error) { throw error;}
                                else {
                                    isSeller = 0;
                                return done(null,user) 
                            }   
                            });
                        }     
                    });
                }else{
                    bcrypt.compare(password, user.password, (error, isMatch) => {
                        if (error) { 
                            throw error;}
                        else {
                            isSeller = 1;
                            return done(null,user)
                         }   
                    });
                }
            })
            passport.serializeUser(function(user, done) {
                if(isSeller == 1){
                    done(null, user.sellerid);
                }   
                else  {
                    done(null, user.userid); 
                }  
            });
            passport.deserializeUser(function(id, done) {
                if(isSeller == 1){
                    Seller.findOne({where :{'sellerid' : id}}).then(function(user,err){
                        done(err, user);
                    });
                }else{
                    Buyer.findOne({where:{'userid':id}}).then(function(user,err){
                        done(err, user);
                    });
                }
            });
        })
    )
}