
let bcrypt = require('bcrypt');
let nodemailer = require('nodemailer');
require('dotenv').config()
let otpGen = require('otp-generator');
let { registerValidation } = require('../validation/uservalidation');
const { defaultMaxListeners } = require('nodemailer/lib/mailer');
const Seller = require('../model/sellermodel');
const user = require('../model/usermodel');
let Prdt = require('../model/prdtmodel');
let usercontroller ={}
let otp,useremail,usertype;

/* For index page */
usercontroller.index = async(req,res,next)=>{
    let prdts 
    await prdt.findAll().then(data=>{
        prdts = data
    })
    res.render('u_index',{prdts:prdts})      
};

/* For user registration get method */
usercontroller.register = async(req,res,next)=>{
    res.render('u_register')
};

// For user registration post method.
usercontroller.registerUser = async(req,res,next)=>{

    const { error } = registerValidation(req.body)
    if(error) return res.send(error.details[0].message)
    let seq
    usertype = req.body.usertype
    useremail = req.body.email;
    // Checking if password and confirmed password are same
    if(req.body.password != req.body.confirmpassword)
        return res.send("Password didnot match. Please try again")

    // Hashing the passwords
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt)

    if(usertype == 0 ){
        const emailExist = await Seller.findAll({ where: { email: req.body.email }})
        console.log(emailExist,'======email in seller')
        if(emailExist.length != 0){ return res.send('Email already exists')}
        else{
            const userData = await Seller.max('sellerid')
            console.log(userData)
            if(!userData){
             seq = "SLR001"        
            }else{
                let id = (Number(userData.slice(3,7))+1).toString()
                let targetLength = 4-id.length
                let uid = id.padStart(targetLength, 0)
                seq = "SLR"+uid
            }
            let {fname,lname,email,gender,city,state}=req.body
            let  sellerid =seq
            Seller.create({sellerid,fname,lname,email,password,gender,city,state})
            .then(data=>emailverify(req.body.email),
                res.redirect('/emailverification'))
            .catch(error=> res.send(error))
        }       
    }else{
        const emailExist = await user.findAll({ where: { email: req.body.email }})
        console.log(emailExist,'======email in buyer')
        if(emailExist.length != 0){ return res.send('Email already exists')}
        else{
            const userData = await user.max('userid')
            console.log(userData)
            if(!userData){
             seq = "USR001"        
            }else{
                let id = (Number(userData.slice(3,7))+1).toString()
                let targetLength = 4-id.length
                let uid = id.padStart(targetLength, 0)
                seq = "USR"+uid
            }
            let {fname,lname,email,gender,city,state}=req.body
            let  userid =seq
            user.create({userid,fname,lname,email,password,gender,city,state})
            .then(data=>
                emailverify(req.body.email),
                res.redirect('/emailverification'))
            .catch(error=> res.send(error))
        }       
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
                user.update({ verified: 1 },
                    { where: { email: useremail } }
                  )
                    .success(result =>
                     res.redirect('/loginbuyer')
                    )
                    .error(err =>
                     res.send(error)
                    )
            }else{
                Seller.update({ verified: 1 },
                    { where: { email: useremail } }
                  )
                    .success(result =>
                     res.redirect('/loginseller')
                    )
                    .error(err =>
                     res.send(error)
                    )
            }
        }catch(err){
            return res.send("Error")
        }
    }
};


// Function for sending Email
const emailverify =(email)=>{

    otp = otpGen.generate(6, { upperCase: false, specialChars: false ,alphabets: false});
    var transporter = nodemailer.createTransport({       //dotenv file
    service: 'gmail',
    auth: {                                   
        user: process.env.EMAIL,  
        pass: process.env.PASS
    }});

    var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Email verification',
    text: 'You have successfully created a Fleet Market account. Please Verify  your Account using OTP Shared Below. '+ otp
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) { console.log(error);} 
    else {console.log('Email sent: ' + info.response);}
    });
};

module.exports = usercontroller;


