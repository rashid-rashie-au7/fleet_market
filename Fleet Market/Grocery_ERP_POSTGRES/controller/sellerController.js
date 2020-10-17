let passport = require('passport');
let { loginValidation} = require('../validation/uservalidation');
let Prdt = require('../model/prdtmodel');
let Seller = require('../model/sellermodel');
let sequelize = require('sequelize')

let sellerController = {}

// SELLER LOGIN CONTROLLER
sellerController.login = async(req,res,next)=>{
    res.render('s_login')
};

sellerController.loginUser = async(req,res,next)=>{
    // Validate data before logging user
    const { error } = loginValidation(req.body);
    if(error){
        return res.send(error.details[0].message);
    };
    
    passport.authenticate('local',{
        successRedirect: '/sellerhome',
        failureRedirect: '/loginseller',
        failureFlash: true
    })(req, res, next)

};

sellerController.productlist = async(req,res,next)=>{
    if(req.session.passport){
        let sellerid = req.session.passport.user
        let prdts,f_name
        await Prdt.findAll({where:{'sellerid':sellerid}}).then(prdt=>{
                console.log(prdt)
                prdts =prdt;
        });
        await Seller.findOne({ where: { 'sellerid':sellerid } }).then(seller => {
            f_name =seller.fname;
        })
        console.log(prdts)
        res.render('s_home',{prdts:prdts,firstname:f_name}) 
    }else{
        res.redirect('/loginseller')
    } 
}

sellerController.create = async(req,res,next)=>{
    if(req.session.passport){
        let sellerid = req.session.passport.user
        let f_name
        await Seller.findOne({ where: { 'sellerid':sellerid } }).then(seller => {
            f_name =seller.fname;
        })
        res.render('s_productAdd',{firstname:f_name}) 
    }else{
        res.redirect('/loginseller')
    }
}

sellerController.createProduct = async(req,res,next)=>{         
    let sellerid = req.session.passport.user
    let prdtid
    const userData = await Prdt.max('prdtid')
    if(!userData){
     prdtid = "PDT001"        
    }else{
        let id = (Number(userData.slice(3,7))+1).toString()
        let targetLength = 4-id.length
        let uid = id.padStart(targetLength, 0)
        prdtid = "PDT"+uid
    }
    let {prdtname,descn,brand,price,offerper,category,qty,life,imgpath}=req.body
    price = (Number(price)).toFixed(2)
    let offer= price - (price*offerper/100)
    offer = Math.round(offer*2)/2 - 0.01;
    await Prdt.create({prdtid,prdtname,descn,brand,category,price,offerper,offer,qty,sellerid,life,imgpath})
    .then(data=>res.redirect(req.get('referer')))
    .catch(error=> res.send(error))
};

sellerController.update = async(req,res,next)=>{
    let id = req.query.id 
    if(req.session.passport){
        let f_name,prdt
        await Prdt.findOne({ where: { 'prdtid':id } }).then(prdtss => {
            prdt = prdtss
        })
        let sellerid = req.session.passport.user
        await Seller.findOne({ where: { 'sellerid':sellerid } }).then(seller => {
            f_name =seller.fname;
        })
        res.render('s_prdtUpdate',{prdts:prdt,firstname:f_name}) 
    }else{
        res.redirect('/loginseller')
    }      
};

sellerController.updateProduct = async(req,res,next)=>{
    let id = req.query.id 
    let sellerid = req.session.passport.user
    let offerper =req.body.offerper, price = req.body.price
    let offer = price - (price*offerper/100)
    await Prdt.update({
        sellerid : sellerid,
        brand : (req.body.brand).charAt(0).toUpperCase() + (req.body.brand).slice(1),
        prdtname: (req.body.prdtname).charAt(0).toUpperCase() + (req.body.prdtname).slice(1),
        descn: (req.body.des).charAt(0).toUpperCase() + (req.body.des).slice(1),
        price : req.body.price,
        offer: offer,
        offerper : offerper,
        category: req.body.cat,
        qty : req.body.qty,
        life: req.body.life,
        imgpath: req.body.image
    },{where:{prdtid: id}})
    .then(data=>res.redirect('/sellerhome'))
    .catch(error=> res.send(error))
   
}

sellerController.deleteProduct = async(req,res,next)=>{
    let id = req.query.id 
    await Prdt.destroy({where:{'prdtid': id}})
        .then(data=>res.redirect('/sellerhome'))
        .catch(error=> res.send(error))
}

sellerController.sellerProfile = async(req,res,next) =>{
    if(req.session.passport){
        let sellerid = req.session.passport.user
        let seller
        await Seller.findOne({ where: { 'sellerid':sellerid } }).then(data => {
            seller = data;
        })
        res.render('s_profile',{data:seller})
    }else{
        res.redirect('/sellerhome')
    }       
};

sellerController.sellerProfileDetails = async(req,res,next)=>{
    let sellerid = req.session.passport.user
    await Seller.update({ 
        fname: (req.body.fname).charAt(0).toUpperCase() + (req.body.fname).slice(1),
        lname: (req.body.lname).charAt(0).toUpperCase() + (req.body.lname).slice(1),
        email: req.body.email,
        gender : req.body.gender,
        state: req.body.state,
        city: (req.body.city).charAt(0).toUpperCase() + (req.body.city).slice(1),
        gstno : req.body.gstno,
        mobile : req.body.mobile,
        shop : req.body.shop,
        street : req.body.street,
        pin : req.body.pin,
        po : req.body.po
    },{where:{sellerid:sellerid}})
    .then(data=> res.redirect('/sellerhome'))
    .catch(error=> res.send(error))  
};

sellerController.logout = async(req,res,next)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
    req.session.destroy(function(err) {
        console.log(err)
      })
}

module.exports = sellerController;