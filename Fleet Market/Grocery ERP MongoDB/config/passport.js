let LocalStrategy = require('passport-local').Strategy;
let bcrypt = require('bcrypt');

// Load User model
let Seller = require('../model/sellermodel');
let Buyer = require('../model/usermodel')

module.exports = function(passport) {
    let isSeller 
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            Seller.findOne({ email : email }, function(err, user) {
                if(!err && user){
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (isMatch== false ) { 
                            return done(err);    
                        }
                        else if(isMatch== true){
                            isSeller = 1;
                            return done(null,user) }   
                    });
                }
                Buyer.findOne({ email : email }, function(err, user) {
                    if (! err && user ) {
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if (isMatch== false ) { 
                                return done(err, false);    
                            }
                            else if(isMatch== true){
                                isSeller = 0;
                                return done(null,user) }     
                        });
                    }
                }); 
            })

            passport.serializeUser(function(user, done) {
                if(isSeller == 1)
                    done(null, user.sellerid);
                else  
                    done(null, user.userid); 
            });

            passport.deserializeUser(function(id, done) {
                if(isSeller == 1){
                    Seller.findOne({sellerid:id}, (err, user) =>{
                        if (err && err.code == 'ENOUSER') { return done(null, false); }
                        done(err, user);
                    });
                }else{
                    Buyer.findOne({userid:id}, (err, user) =>{
                        if (err && err.code == 'ENOUSER') { return done(null, false); }
                        done(err, user);
                    });
                }
            });

        })
    );
}
