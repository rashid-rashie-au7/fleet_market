let passport = require('passport');
let { loginValidation} = require('../validation/uservalidation');
let Prdt = require('../model/prdtmodel');
let User = require('../model/usermodel');
let Seller = require('../model/sellermodel');
let Cart = require('../model/cartmodel');
let Wishlist =  require('../model/wishlistmodel');
let Order = require('../model/ordermodel')

let buyerController = {}

buyerController.login = async(req,res,next)=>{
    res.render('b_login')
};

buyerController.loginUser = async(req,res,next)=>{
    // Validate data before logging user
    const { error } = loginValidation(req.body);
    if(error){
        return res.send(error.details[0].message);
    };
    passport.authenticate('local',{
        successRedirect: '/homebuyer',
        failureRedirect: '/loginbuyer',
        failureFlash: true
    })(req, res, next)
};


buyerController.home = async(req,res,next)=>{
    let prdts,user
    if(req.session.passport){
        let userid = req.session.passport.user
        await Prdt.findAll().then(prdt=>{
            console.log(prdt)
            prdts =prdt;
        });
        await User.findOne({ where: { 'userid':userid } }).then(users => {
            user =users.fname;
        })
        res.render('b_home',{prdts:prdts,firstname:user}) 
    }else{
        res.redirect('/')
    } 
};

buyerController.detailProduct = async(req,res,next)=>{
    let id = req.query.id 
    let userid = req.session.passport.user
    let prdts,f_name,username
    await Prdt.findOne({where:{'prdtid': id}}).then(prdt=>{
        prdts =prdt;
    });
    await Seller.findOne({ where: {'sellerid':prdts.sellerid} }).then(seller => {
        f_name =seller.fname;
    })
    await User.findOne({ where: { 'userid':userid } }).then(user => {
        username =user.fname;
    }) 
    res.render('b_detailproduct',{prdts:prdts,firstname:username,seller:f_name})   
};

buyerController.addtoCart = async(req,res,next)=>{
    let userid = (req.session.passport.user).trim()
    let id = (req.query.id).trim()
    let sid = (req.query.ss).trim()
    let qty = 0,finddata; 
    console.log("prdtid------>",id,"in")
    // Checking same product in the same user id exist in the cart
    await Cart.findOne({ where: {'prdtid':id ,'userid':userid} }).then(find => {
        finddata = find
    })
    let cartid = await Cart.max('id')
    if(finddata != null){
        qty = (finddata.qty)+1
        console.log("Quantity",qty)
        await Cart.update({qty:qty},{where:{'prdtid':id,'userid':userid}})
        .then(result=>{ res.redirect('/mycart');})
        .catch(error=>res.send(error))
    }else{
        console.log('entered')
        await Cart.create({
           // 'id':cartid+1,
            'prdtid':id,
            'userid':userid,
            'sellerid':sid,
            'qty':1})
        .then(result=>{ res.redirect('/mycart');})
        .catch(error=>res.send(error))
    
    }      
};

buyerController.viewcart = async(req,res,next)=>{
    const arr=[] ; 
    let data ,prdts,username
    let userid=req.session.passport.user
    await Cart.findAll({where:{'userid':userid}}).then(result=>{
        data = result
    })
    for(var i=0; i<=data.length-1; i++){ //1
        await Prdt.findOne({where:{'prdtid':data[i].prdtid}}).then(result=>{
              prdts= result     
        })
        arr.push(prdts) 
    }
    await User.findOne({ where: { 'userid':userid } }).then(user => {
        username =user.fname;
    })
    try {
        res.render('b_prdtcart',{prdts:arr,firstname:username,cart:data}) 
    } catch (error) {
        console.log("Error")
        res.send(error)
    }   
}

buyerController.myprofile =  async(req,res,next)=>{
    if(req.session.passport){
        let userid=req.session.passport.user
        let userdata
        await User.findOne({ where: {'userid':userid} }).then(data => {
            userdata = data;
        })
        res.render('b_profile',{data:userdata})
    }else{
        res.redirect('/homebuyer')
    }       
}

buyerController.updateprofile =  async(req,res,next)=>{
    let userid =req.session.passport.user
    let gen
    if(req.body.gender =='Male'){gen=1} 
    else{gen =0}
    
    await User.update({ 
        fname: (req.body.fname).charAt(0).toUpperCase() + (req.body.fname).slice(1),
        lname: (req.body.lname).charAt(0).toUpperCase() + (req.body.lname).slice(1),
        email: req.body.email,
        gender : gen,
        state: req.body.state,
        city: (req.body.city).charAt(0).toUpperCase() + (req.body.city).slice(1),
        mobile : req.body.mobile,
        home : req.body.home,
        street : req.body.street,
        pin : req.body.pin,
        po : req.body.po
    },{where:{'userid': userid}})
    .then(data=> res.redirect('/homebuyer'))
    .catch(error=> res.send(error)) 
}

/* GET Method */
buyerController.wishlist = async(req,res,next)=>{
    const arr=[] ; 
    let data ,prdts,username
    let userid=req.session.passport.user
    await Wishlist.findAll({where:{'userid':userid}}).then(result=>{
        data = result
    })
    for(var i=0; i<=data.length-1; i++){ //1
        await Prdt.findOne({where:{'prdtid':data[i].prdtid}}).then(result=>{
              prdts= result     
        })
        arr.push(prdts) 
    }
    await User.findOne({ where: { 'userid':userid } }).then(user => {
        username =user.fname;
    })
    try {
        res.render('b_wishlist',{prdts:arr,firstname:username,cart:data}) 
    } catch (error) {
        console.log("Error")
        res.send(error)
    }    
}

/*POST METHOD */
buyerController.mywishlist = async(req,res,next)=>{
    let userid = req.session.passport.user
    let id = req.query.id 
    let ss = req.query.ss
    let wishid = await Wishlist.max('id')
    console.log(wishid)
    if(!wishid){
        wishid = 0
    }
    
    await  Wishlist.create({ 
        'id': wishid+1,
        'prdtid': id,
        'userid' : userid })
    .then(result=>{ res.redirect('/mywishlist');})
    .catch(error=>res.send(error))   
};

/*Removing from Wishlist */
buyerController.removeWishlist = async(req,res,next)=>{
    let userid = req.session.passport.user
    let id = req.query.id
    await Wishlist.destroy({where:{'prdtid': id,'userid':userid}})
    .then(data=>res.redirect('/mywishlist'))
        .catch(error=> res.send(error))
};

/*Removing from Cart */
buyerController.removeCart = async(req,res,next)=>{
    let userid = req.session.passport.user
    let id = req.query.id
    await Cart.destroy({where:{'prdtid': id,'userid':userid}})
    .then(data=>res.redirect('/mycart'))
        .catch(error=> res.send(error))
    
}

buyerController.checkoutlist = async(req,res,next)=>{
    const arr=[] ; 
    let data ,prdts,user
    let userid=req.session.passport.user
    await Cart.findAll({where:{'userid':userid}}).then(result=>{
        data = result
    })
    console.log(data)
    for(var i=0; i<=data.length-1; i++){ //1
        await Prdt.findOne({where:{'prdtid':data[i].prdtid}}).then(result=>{
              prdts= result     
        })
        arr.push(prdts) 
    }
    await User.findOne({ where: { 'userid':userid } }).then(datas => {
        user =datas;
    })
    console.log(arr)
    try {
        res.render('b_checkout',{prdts:arr,user:user,cart:data}) 
    } catch (error) {
        console.log("Error")
        res.send(error)
    }        
};

buyerController.checkout= async(req,res,next)=>{
    let id = req.session.passport.user
    let cart,qty
    // listing all products in cart
    await Cart.findAll({where:{'userid':id}}).then(result=>{
        cart = result
    })
    for(var i=0; i<=cart.length-1; i++){
        await Prdt.findOne({where:{'prdtid':cart[i].prdtid}}).then(async(data)=>{
            let orderid =  Order.max('id')
            qty = data.qty
            if(!orderid){
                orderid = 0
            }
            console.log(data,'=========>')
            await Order.create({
               // 'id':orderid+1,
                'prdtid':data.prdtid,
                'prdtname':data.prdtname,
                'sellerid':data.sellerid,
                'userid':id,
                'price':data.price,
                'offer' : data.offer,
                'total': (data.offer)*cart[i].qty,
                'qty' : cart[i].qty}).then(data=>{console.log("sucesssssssss")

            }).catch(err=>{console.log(err)})
        }) 
        await Prdt.update({'qty':qty-(cart[i].qty)},{where:{'prdtid':cart[i].prdtid}}).then(data=>{
        })   
    }
    await Cart.destroy({where:{'userid':id}}).then(data=>{
        res.redirect('/myorders')
    }).catch(err=>{
        res.send(err)
    }) 
};

buyerController.myorders= async(req,res,next)=>{
    let id = req.session.passport.user
    let user 
    await User.findOne({where:{'userid':id}}).then(data=>{
        user = data.fname
    })
    let orders 
    await Order.findAll({where:{'userid':id}}).then(data=>{
        orders = data
    })
    res.render('b_orders',{orders:orders,user:user})
};


buyerController.category= async(req,res,next)=>{
    let id = req.session.passport.user
    let catgry = req.query.cat
    let user,data
    await User.findOne({where:{'userid':id}}).then(data=>{
        user = data.fname
    })
    await Prdt.findAll({where:{'category':catgry}}).then(prdt=>{
        data =prdt;
    });
    console.log(data)
    res.render('b_prdtcategory',{prdts:data,user:user})
};

module.exports = buyerController;