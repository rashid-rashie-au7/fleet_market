var express = require('express');
var router = express.Router();
var usercontroller = require('../controller/userController');


router.get('/',usercontroller.viewHome);

router.get('/register',usercontroller.register);

router.post('/register',usercontroller.registerUser);

router.get('/emailverification',usercontroller.verifyMail);

router.post('/emailverification',usercontroller.verify);

router.get('/login',usercontroller.login);

router.post('/login',usercontroller.loginUser);



module.exports = router;