
let bcrypt = require('bcrypt');
let nodemailer = require('nodemailer');
let otpGen = require('otp-generator');
let { registerValidation } = require('../validation/uservalidation');
let User = require('../model/usermodel');
let Seller = require('../model/sellermodel');
let Prdt = require('../model/prdtmodel');
require("dotenv").config();


let usercontroller ={}
let otp,useremail,usertype;

/* For index page */
usercontroller.index = async(req,res,next)=>{
    let prdts = await Prdt.find()
    res.render('u_index',{prdts:prdts})      
};

/* For user registration get method */
usercontroller.register = async(req,res,next)=>{
    res.render('u_register')
};

// For user registration post method.
usercontroller.registerUser = async(req,res,next)=>{

    // User input validation
    const { error } = registerValidation(req.body)
    if(error){req.flash('error_msg',error.details[0].message);
       return res.redirect('/register')
    }

    // Checking if the E-mail exists
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) { req.flash('error_msg','Email Already Exists');
            return res.redirect('/register')
    }          
    // Checking if password and confirmed password are same
    if(req.body.password != req.body.confirmpassword)
    { req.flash('error_msg','Password Mismatch');
         return res.redirect('/register')
    }          

    // Hashing the passwords
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt)

    useremail = req.body.email;
    let data 
    usertype = req.body.usertype

    if(req.body.usertype == 0){
        const userData = await Seller.find().sort({sellerid:-1})
        let seq 
        if(userData.length == 0){
             seq = "SLR001"        
        }else{
            let id = (Number(userData[0].sellerid.slice(3,7))+1).toString()
            let targetLength = 4-id.length
            let uid = id.padStart(targetLength, 0)
            seq = "SLR"+uid
        }
        data = new Seller({ 
            firstname: (req.body.firstname).charAt(0).toUpperCase() + (req.body.firstname).slice(1),
            lastname: (req.body.lastname).charAt(0).toUpperCase() + (req.body.lastname).slice(1),
            email: req.body.email,
            gender : req.body.gender,
            sellerid:seq,
            state: req.body.state,
            city: (req.body.city).charAt(0).toUpperCase() + (req.body.city).slice(1),
            password: hashPass
        })
    }else{
        const userData = await User.find().sort({userid:-1})
        let seq 
        if(userData.length == 0){
             seq = "USR001"        
        }else{
            let id = (Number(userData[0].userid.slice(3,7))+1).toString()
            let targetLength = 4-id.length
            let uid = id.padStart(targetLength, 0)
            seq = "USR"+uid
        }
        data = new User({ 
            firstname: (req.body.firstname).charAt(0).toUpperCase() + (req.body.firstname).slice(1),
            lastname: (req.body.lastname).charAt(0).toUpperCase() + (req.body.lastname).slice(1),
            email: req.body.email,
            gender : req.body.gender,
            userid:seq,
            state: req.body.state,
            city: (req.body.city).charAt(0).toUpperCase() + (req.body.city).slice(1),
            password: hashPass
        })  
    }
    try {
        await data.save()
        emailverify(req.body.email)
        res.redirect('/emailverification')
    } catch (error) {
        res.send(error)
    }
};

// Email verification get controller.
usercontroller.verifyMail= async(req,res,next)=>{
    res.render('u_emailverification')
};

// Email verification Post controller.
usercontroller.verify = async(req,res,next)=>{
    let data = req.body.otp
    if(!data) return res.send("Enter otp")
    if(data == otp){ 
        try{
            if(usertype==1){
                await User.update({ email: useremail },{verify:1});
                res.redirect('/loginbuyer')
            }else{
                await Seller.update({ email: useremail },{verify:1});
                res.redirect('/loginseller')
            }
        }catch(err){
            return res.send("Error")
        }
    }
};


// Function for sending Email
const emailverify =(email)=>{
    otp = otpGen.generate(6, { upperCase: false, specialChars: false ,alphabets: false});
    var transporter = nodemailer.createTransport({ 
    service: process.env.SERVICE,
    auth: {                                   
        user: process.env.EMAIL,  
        pass: process.env.PASS
    }
    });
    var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Fleet Market',
    text: 'You have successfully created a Fleet Market account. Please Verify your account using below OTP  '+otp
    }
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {   
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
};

/* USER categorywise listing */
usercontroller.categorywise= async(req,res,next)=>{
    let catgry = req.query.cat
    if(catgry== 'Vegetables ') catgry= 'Vegetables & Fruits'
    let data = await Prdt.find({catgy:catgry})
    let seller = await Seller.findOne({sellerid:data[0].sellerid}).select({'shop':1,"_id":0})
    res.render('u_category',{prdts:data,seller:seller.shop})
}; 

/*Getting particular product details */
usercontroller.productdetails= async(req,res,next)=>{
    let id = req.query.id 
    let prdts = await Prdt.findOne({prdtid: id})
    let seller = await Seller.findOne({sellerid:prdts.sellerid}).select({'shop':1,"_id":0})
    res.render('u_detailproduct',{prdts:prdts,seller:seller.shop})   
}; 

module.exports = usercontroller;


