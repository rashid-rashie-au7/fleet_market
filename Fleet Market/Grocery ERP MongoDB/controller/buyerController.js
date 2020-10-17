let passport = require('passport');
let { loginValidation} = require('../validation/uservalidation');
let Prdt = require('../model/prdtmodel');
let User = require('../model/usermodel');
let Seller = require('../model/sellermodel');
let Cart = require('../model/cartmodel');
let Wishlist =  require('../model/wishlistmodel');
let Order = require('../model/ordermodel')

let buyerController = {}

/* Login Get method for user */
buyerController.login = async(req,res,next)=>{
    res.render('b_login')
};

/*Login POST method for user */
buyerController.loginUser = async(req,res,next)=>{

    // Validate data before logging user 
    const { error } = loginValidation(req.body);
    if(error){
        return res.send(error.details[0].message);
    };

    // Passport Authentication 
    passport.authenticate('local',{
        successRedirect: '/homebuyer',
        failureRedirect: '/loginbuyer',
        failureFlash: true
    })(req, res, next)
    req.flash('error_msg','Invalid Username or password');
};

/* Home page for buyer */
buyerController.home = async(req,res,next)=>{
    if(req.session.passport){
        let userid = req.session.passport.user
        let prdts = await Prdt.find()
        let user = await User.findOne({userid:userid}).select({'firstname':1,"_id":0})
        res.render('b_home',{prdts:prdts,firstname:user.firstname}) 
    }else{
        res.redirect('/')
    } 
};

/* Detail product GET method for user */
buyerController.detailProduct = async(req,res,next)=>{
    let id = req.query.id 
    if(req.session.passport){ 
        let userid = req.session.passport.user
        let prdts = await Prdt.findOne({prdtid: id})
        let seller = await Seller.findOne({sellerid:prdts.sellerid}).select({'shop':1,"_id":0})
        let user = await User.findOne({userid:userid}).select({'firstname':1,"_id":0})
        res.render('b_detailproduct',{prdts:prdts,firstname:user.firstname,seller:seller.shop}) 
    }else{
        res.redirect('/loginbuyer')}  
};

/* Add to cart post method */
buyerController.addtoCart = async(req,res,next)=>{
    if(req.session.passport){
        let userid = req.session.passport.user,
            id = req.query.id ,
            ss = req.query.ss,
            qty = 0;
        let data;
        let finddata = await Cart.findOne({prdtid:id,userid:userid})
        if(finddata)
            qty = (finddata.qty)+1
        else{
            data = new Cart({ 
                prdtid: id,
                userid : userid,
                sellerid: ss,
                qty: 1
            })
        }
        try {
            if(qty == 0){
                await data.save()
            }else{
                await Cart.update({prdtid:id,userid:userid},{qty:qty})}
            res.redirect('/mycart');
        } catch (error) {
            res.send(error)
        }  
    }else{
        res.redirect('/loginbuyer')
    } 
};

/* GET method for view cart  */
buyerController.viewcart = async(req,res,next)=>{
    if(req.session.passport){
        const arr=[] ;  
        let userid=req.session.passport.user
        let cart = await Cart.find({userid:userid})
        for(var i=0; i<=cart.length-1; i++){
        let prdts= await Prdt.findOne({prdtid:cart[i].prdtid})
            arr.push(prdts) 
        }
        let user = await User.findOne({userid:userid}).select({'firstname':1,"_id":0})
        try {
            res.render('b_prdtcart',{prdts:arr,firstname:user.firstname,cart:cart}) 
        } catch (error) {
            res.send(error)
        }
    }else{
        res.redirect('/loginbuyer')
    }   
}

/* Profile page for buyer */
buyerController.myprofile =  async(req,res,next)=>{
    if(req.session.passport){
        let userid=req.session.passport.user
        let data = await User.findOne({userid:userid})
        res.render('b_profile',{data:data})
    }else{
        res.redirect('/loginbuyer')
    }   
}

/* Update method for buyer profile */
buyerController.updateprofile =  async(req,res,next)=>{
    if(req.session.passport){
        let id =req.session.passport.user
        let gen
        if(req.body.gender =='Male'){gen=1} 
        else{gen =0}
        let data = await User.update({userid: id},{
            firstname: (req.body.fname).charAt(0).toUpperCase() + (req.body.fname).slice(1),
            lastnmae: (req.body.lname).charAt(0).toUpperCase() + (req.body.lname).slice(1),
            home : (req.body.home).charAt(0).toUpperCase() + (req.body.home).slice(1),
            street:  (req.body.street).charAt(0).toUpperCase() + (req.body.street).slice(1),
            phone:  req.body.mob,
            state : ( req.body.state).charAt(0).toUpperCase() + (req.body.state).slice(1),
            city:  (req.body.city).charAt(0).toUpperCase() + (req.body.city).slice(1),
            pin:  req.body.pin,
            po:  (req.body.po).charAt(0).toUpperCase() + (req.body.po).slice(1),
            gender: gen
        }, {new : true})
        res.redirect('/homebuyer')
    }else{
        res.redirect('/loginbuyer')
    } 
}

/* GET Method for buyer wishlist*/
buyerController.wishlist = async(req,res,next)=>{
    if(req.session.passport){
        const arr=[] ;  
        let userid=req.session.passport.user
        let wishlistProduct = await Wishlist.find({userid:userid})
        for(var i=0; i<=wishlistProduct.length-1; i++){
        let prdts= await Prdt.findOne({prdtid:wishlistProduct[i].prdtid})
            arr.push(prdts) 
        }
        let user = await User.findOne({userid:userid}).select({'firstname':1,"_id":0})
        try {
            res.render('b_wishlist',{prdts:arr,firstname:user.firstname}) 
        } catch (error) {
            res.send(error)
        }
    }else{
        res.redirect('/loginbuyer')
    }    
}

/*POST METHOD for adding to wishlist*/
buyerController.mywishlist = async(req,res,next)=>{
    if(req.session.passport){
        let userid = req.session.passport.user
        let id = req.query.id 
        let ss = req.query.ss
        const data = new Wishlist({ 
            prdtid: id,
            userid : userid,
            sellerid: ss,
            qty: 1
        })
        try {
            await data.save()
            res.redirect('/mywishlist');
        } catch (error) {
            res.send(error)
        }
    }else{
        res.redirect('/loginbuyer')
    } 
};

/*Removing from Wishlist */
buyerController.removeWishlist = async(req,res,next)=>{
    if(req.session.passport){
        let userid = req.session.passport.user
        let id = req.query.id
        let prdts = await Wishlist.deleteOne({prdtid: id,userid:userid})
        res.redirect('/mywishlist')
    }else{
        res.redirect('/loginbuyer')
    } 
}

/*Removing from Cart */
buyerController.removeCart = async(req,res,next)=>{
    if(req.session.passport){
        let userid = req.session.passport.user
        let id = req.query.id
        let prdts = await Cart.deleteOne({prdtid: id,userid:userid})
        res.redirect('/mycart')
    }else{
        res.redirect('/loginbuyer')
    } 
    
}

/* Viewing the Checkout page */
buyerController.checkoutlist = async(req,res,next)=>{
    if(req.session.passport){
        const arr=[] ;  
        let userid = req.session.passport.user
        let cart = await Cart.find({userid:userid})
        let Userdata = await User.findOne({userid:userid})

        for(var i=0; i<=cart.length-1; i++){
        let prdts= await Prdt.findOne({prdtid:cart[i].prdtid})
        prdts['qty']=cart[i].qty
            arr.push(prdts) 
        }
        try {
            res.render('b_checkout',{prdts:arr,user:Userdata,cart:cart}) 
        } catch (error) {
            res.send(error)
        }  
    }else{
        res.redirect('/loginbuyer')
    }   
};

/*Post method for buyer checkout  */
buyerController.checkout= async(req,res,next)=>{
    if(req.session.passport){
        const arr =[]
        let id = req.session.passport.user
        const orderid = await Order.find().sort({oid:-1})
        let strid
        if(orderid.length == 0){
            strid = "OID001"        
        }else{
            let id = (Number(orderid[0].oid.slice(3,7))+1).toString()
            let trg_len = 4-id.length
            let uid = id.padStart(trg_len, 0)
            strid = "OID"+uid
        }
        let cart =await Cart.find({userid:id})
        for(var i=0; i<=cart.length-1; i++){
            let prdts= await Prdt.findOne({prdtid:cart[i].prdtid})
            let offer = (prdts.price) -((prdts.price * prdts.offer)/100)
            let orders = new Order({
                oid:strid,
                prdtid:prdts.prdtid,
                sellerid:prdts.sellerid,
                userid:id,
                price:prdts.price,
                offer : offer,
                total: offer*cart[i].qty,
                qty : cart[i].qty
            })
            await orders.save() 
        }
        await Cart.deleteMany({userid:id})
        res.redirect('/myorders')
    }else{
        res.redirect('/loginbuyer')
    }

};

/* GET myorders for buyer */
buyerController.myorders= async(req,res,next)=>{
    if(req.session.passport){
        let id = req.session.passport.user
        const prdts =[]
        let user = await User.findOne({userid:id}).select({'firstname':1,"_id":0})
        let orders = await Order.find({userid:id})

        for(var i = 0; i<orders.length; i++){
            let prdt = await Prdt.findOne({prdtid:orders[i].prdtid})
            prdt['oid']=orders[i].oid
            prdt['price']=orders[i].price
            prdt['offer']=orders[i].offer
            prdt['total']=orders[i].total
            prdt['qty']=orders[i].qty
            prdt['date']=orders[i].date
            prdts.push(prdt) 
        }
        res.render('b_orders',{orders:prdts,user:user})
    }else{
        res.redirect('/loginbuyer')
    }
};

/*Category listing for product*/
buyerController.category= async(req,res,next)=>{
    if(req.session.passport){
        let id = req.session.passport.user
        let catgry = req.query.cat
        if(catgry== 'Vegetables ') catgry= 'Vegetables & Fruits'
        let user = await User.findOne({userid:id}).select({'firstname':1,"_id":0})
        let data = await Prdt.find({catgy:catgry})
        if (data.length >0){
            let seller = await Seller.findOne({sellerid:data[0].sellerid}).select({'shop':1,"_id":0})
            res.render('b_prdtcategory',{prdts:data,user:user,seller:seller})
        }else{res.render('b_prdtcategory',{prdts:data,user:user})}
    }else{
        res.redirect('/loginbuyer')
    }
    
}; 

// buyerController.search = async(req,res,next)=>{
//     let id = req.session.passport.user
//     let sid = req.query.sid
//     let key =  req.query.key
//     let catgry = req.query.cat
//     let user = await User.findOne({userid:id}).select({'firstname':1,"_id":0})
//     let data= await find({ prdtname: { $regex : ".*"+ key +".*", $options:'i' } })
//     // let data = await Prdt.find({prdtname:key})
//     res.render('b_prdtcategory',{prdts:data,user:user})
// };

/* For Cart update */
buyerController.updateqty= async(req,res,next)=>{
    if(req.session.passport){
        let uid = req.session.passport.user
        let id = req.query.id
        let flag = req.query.flag
        let finddata = await Cart.findOne({prdtid:id,userid:uid})
        if(flag == 1){
            await Cart.update({prdtid:id,userid:uid},{qty:(finddata.qty)+1})
        }else if(flag==0){
            await Cart.update({prdtid:id,userid:uid},{qty:(finddata.qty)-1})
        }
        res.redirect('/mycart');
    }else{
        res.redirect('/loginbuyer')
    }
}; 


module.exports = buyerController;