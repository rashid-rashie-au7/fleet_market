var express = require('express');
var router = express.Router();
const userController  = require('../controller/userController');

/* GET home page. */
router.get('/',userController.index);

// /* Get Register Page */
router.get('/register',userController.register)

// /* POST Register  */
router.post('/register',userController.registerUser);

// /* GET EmailVerification Page */
router.get('/emailverification',userController.verifyMail);

/* POST EmailVerification */
router.post('/emailverification',userController.verify);




module.exports = router;
