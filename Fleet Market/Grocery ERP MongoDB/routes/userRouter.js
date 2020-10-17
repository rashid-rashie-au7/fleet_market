var express = require('express');
var router = express.Router();
const userController  = require('../controller/userController');

/* GET home page. */
router.get('/',userController.index);

/* Get Register Page */
router.get('/register',userController.register)

/* POST Register  */
router.post('/register',userController.registerUser);

/* GET EmailVerification Page */
router.get('/emailverification',userController.verifyMail);

/* POST EmailVerification */
router.post('/emailverification',userController.verify);

/* GET Category Page */
router.get('/categorywise',userController.categorywise);

/* GET Product Page */
router.get('/productdetails',userController.productdetails)

module.exports = router;
