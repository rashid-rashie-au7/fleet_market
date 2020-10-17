let passport = require('passport');
let { loginValidation} = require('../validation/uservalidation');
let Prdt = require('../model/prdtmodel');
let Seller = require('../model/sellermodel');

let sellerController = {}

// SELLER LOGIN CONTROLLER
sellerController.login = async(req,res,next)=>{
    res.render('s_login')
};

/* Seller Login post method */
sellerController.loginUser = async(req,res,next)=>{
    
    const { error } = loginValidation(req.body);
    if(error){
        return res.send(error.details[0].message);
    };
        passport.authenticate('local',{
        successRedirect: '/sellerhome',
        failureRedirect: '/loginseller',
        failureFlash: true
        })(req, res, next)
        req.flash('error_msg','Invalid Username or password');
};

/* Seller product listing GET method*/
sellerController.productlist = async(req,res,next)=>{
    if(req.session.passport){
        let sellerid = req.session.passport.user
        if(sellerid.startsWith('SLR')){
            let prdts = await Prdt.find({sellerid:sellerid})
            let sellers = await Seller.findOne({sellerid:sellerid}).select({'firstname':1,"_id":0})
            res.render('s_home',{prdts:prdts,firstname:sellers.firstname})
        } else{
            res.redirect('/loginseller')
            req.flash('error_msg','User doesnot exist');
        }
    }else{
        res.redirect('/')}
}

/* Add product create page */
sellerController.create = async(req,res,next)=>{
    if(req.session.passport){
        let sellerid = req.session.passport.user
        let sellers = await Seller.findOne({sellerid:sellerid}).select({'firstname':1,"_id":0})
        res.render('s_productAdd',{firstname:sellers.firstname}) 
    }else{
        res.redirect('/loginseller')
    }
}
/* Add product POST Method */
sellerController.createProduct = async(req,res,next)=>{ 
    if(req.session.passport){        
        let sellerid = req.session.passport.user
        let prdts = await Prdt.find().sort({prdtid:-1})
        let strid
        if(prdts.length == 0){
            strid = "PRDT001"        
        }else{
            let id = (Number(prdts[0].prdtid.slice(4,7))+1).toString()
            let trg_len = 4-id.length
            let uid = id.padStart(trg_len, 0)
            strid = "PRDT"+uid
        }
        const data = new Prdt({ 
            prdtid: strid,
            sellerid : sellerid,
            brand : (req.body.brand).charAt(0).toUpperCase() + (req.body.brand).slice(1),
            prdtname: (req.body.prdtname).charAt(0).toUpperCase() + (req.body.prdtname).slice(1),
            descn: (req.body.des).charAt(0).toUpperCase() + (req.body.des).slice(1),
            price : req.body.price,
            offer: req.body.offer,
            catgy: req.body.cat,
            qty : req.body.qty,
            life: req.body.life,
            imgpath: req.body.image
        })
        try {
            await data.save()
            req.flash('success_msg','Product saved successfully');
            res.redirect(req.get('referer'));
        } catch (error) {
        req.flash('error_msg','Error in adding product');  
        }
    }else{
        res.redirect('/loginseller')
    }
};

/* Product details update page */
sellerController.update = async(req,res,next)=>{
    let id = req.query.id 
    if(req.session.passport){
        let prdts = await Prdt.findOne({prdtid: id})
        let sellerid = req.session.passport.user
        let sellers = await Seller.findOne({sellerid:sellerid}).select({'firstname':1,"_id":0})
        res.render('s_prdtUpdate',{prdts:prdts,firstname:sellers.firstname}) 
    }else{
        res.redirect('/loginseller')
    }      
};

/* Product details update page POST method */
sellerController.updateProduct = async(req,res,next)=>{
    if(req.session.passport){
        let id = req.query.id 
        let sellerid = req.session.passport.user
        let data = await Prdt.update({prdtid: id},{
            sellerid : sellerid,
            brand : (req.body.brand).charAt(0).toUpperCase() + (req.body.brand).slice(1),
            prdtname: (req.body.prdtname).charAt(0).toUpperCase() + (req.body.prdtname).slice(1),
            descn: (req.body.des).charAt(0).toUpperCase() + (req.body.des).slice(1),
            price : req.body.price,
            offer: req.body.offer,
            catgy: req.body.cat,
            qty : req.body.qty,
            life: req.body.life,
            imgpath: req.body.image
        }, {new : true})
        res.redirect('/sellerhome')
    }else{
        res.redirect('/loginseller')
    }
}

/* Deleting Product details   */
sellerController.deleteProduct = async(req,res,next)=>{
    if(req.session.passport){
        let id = req.query.id 
        let prdts = await Prdt.deleteOne({prdtid: id})
        res.redirect('/sellerhome')
    }else{
        res.redirect('/loginseller')
    }
}
/* Seller profile update page */
sellerController.sellerProfile = async(req,res,next) =>{
    if(req.session.passport){
        let sellerid = req.session.passport.user
        let sellers = await Seller.findOne({sellerid:sellerid})
        res.render('s_profile',{seller:sellers}) 
    }else{
        res.redirect('/loginseller')
    } 
};

/* seller profile update page post method */
sellerController.sellerProfileDetails = async(req,res,next)=>{
    if(req.session.passport){
        let sellerid = req.session.passport.user
        let gen
        console.log('gender ===',req.body.gender)
        if(req.body.gender =='Male'){gen=1} 
        else{gen =0}
        let data = await Seller.update({sellerid:sellerid},{ 
            firstname: (req.body.fname).charAt(0).toUpperCase() + (req.body.fname).slice(1),
            lastname: (req.body.lname).charAt(0).toUpperCase() + (req.body.lname).slice(1),
            gender : gen,
            state: req.body.state,
            city: (req.body.city).charAt(0).toUpperCase() + (req.body.city).slice(1),
            gstnumber : req.body.gst,
            phone : req.body.mobile,
            shop : (req.body.shop).charAt(0).toUpperCase() + (req.body.shop).slice(1),
            street : req.body.street,
            pin : req.body.pin,
            po : req.body.po
        })
        res.redirect('/sellerhome')
    }else{
        res.redirect('/loginseller')
    } 
};

/* USER logout */
sellerController.logout = async(req,res,next)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
    req.session.destroy(function(err) {
        console.log(err)
    })

}

module.exports = sellerController;