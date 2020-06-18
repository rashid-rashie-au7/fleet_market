let jwt = require('jsonwebtoken');
let Joi = require('@hapi/joi');
let bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpGen = require('otp-generator');
let { registerValidation ,loginValidation} = require('../validation/uservalidation');
let User = require('../model/usermodel');

let usercontroller ={}
let otp,useremail //Change it to id

// For home page
usercontroller.viewHome = async(req,res,next)=>{
    res.render('home')
    
};

// For user registration get method
usercontroller.register = async(req,res,next)=>{
    res.render('register')
};

// For user registration post method.
usercontroller.registerUser = async(req,res,next)=>{
    // User input validation
    const { error } = registerValidation(req.body)
    if(error){
        return res.send(error.details[0].message)
    }

    // Checking if the E-mail exists
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist){
        return res.send('Email already exists') // Add pop up
           
    }

    // Checking if password and confirmed password are same
    if(req.body.password != req.body.confirmpassword){
        return res.send("Password didnot match. Please try again")
    }

    // Hashing the passwords
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt)

    useremail = req.body.email;
    
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
    console.log(seq)
    const data = new User({ 
        firstname: (req.body.firstname).charAt(0).toUpperCase() + (req.body.firstname).slice(1),
        lastname: (req.body.lastname).charAt(0).toUpperCase() + (req.body.lastname).slice(1),
        email: req.body.email,
        gender : req.body.gender,
        userid: seq,
        state: req.body.state,
        city: (req.body.city).charAt(0).toUpperCase() + (req.body.city).slice(1),
        usertype : req.body.usertype,
        password: hashPass
    })
    try {
        await data.save()
        console.log("Done")
        emailverify(req.body.email)
        res.redirect('/home/emailverification')
    } catch (error) {
        console.log("Error")
        res.send(error)
    }
};

// Email verification get controller.
usercontroller.verifyMail= async(req,res,next)=>{
    res.render('emailverification')
};

// Email verification Post controller.
usercontroller.verify = async(req,res,next)=>{
    let data = req.body.otp
    if(!data) return res.send("Enter otp")
    if(data == otp){
        //Add pop up 
        try{
            await User.update({ email: useremail },{verify:1});
            console.log("updated")
            res.redirect('/home/login')
        }catch(err){
            return res.send("Error")
        }
    }

};
usercontroller.login = async(req,res,next)=>{
    res.render('login')
};

usercontroller.loginUser = async(req,res,next)=>{
    // Validate data before logging user
    const { error } = loginValidation(req.body);
    if(error){
        return res.send(error.details[0].message);
    };
    
    // Checking if email exists
    const data = await User.findOne({ email: req.body.email });
    if(!data){
        return res.send(`Email doesn't exists`)
    }

    // Password checking
    const validPass = await bcrypt.compare(req.body.password, data.password);
    if(!validPass){
        return res.send('Invalid Password')
    }

    // Checking whether Email verification completed.
    if(data.verify != 1) {
        emailverify(req.body.email)
         //res.send('Email verification pending')  //popup
         return res.redirect('/home/emailverification')
    }

    // Create and assign a token
    let secretJWT = "kjhsdhgksj65sd465s5d6+as6+d5s6+d5+as9d86a87"
    const token = jwt.sign({ _id: data._id }, secretJWT);
    res.header('auth-token', token)
   // res.local.auth_token = auth_token
  
    if(data.usertype == 0) return res.redirect('/seller')
    if(data.usertype == 1) return res.redirect('/users/buyer')
    
};


// Function for sending Email
const emailverify =(email)=>{

    otp = otpGen.generate(6, { upperCase: false, specialChars: false ,alphabets: false});
    console.log(otp)

    var transporter = nodemailer.createTransport({       //dotenv file
    service: 'gmail',
    auth: {                                   
        user: 'rashie2012@gmail.com',  
        pass: '95671495'
    }
    });

    var mailOptions = {
    from: 'rashie2012@gmail.com',
    to: email,
    subject: 'Email verification',
    text: 'Your OTP is '+otp
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
};


module.exports = usercontroller;


