var express = require('express');
var router = express.Router();
const sellerController  = require('../controller/sellerController');
let {ensureAuthenticated ,forwardAuthenticated} = require('../config/auth');

/*GET Login Page */
router.get('/loginseller',forwardAuthenticated, sellerController.login);

/* POST Login */
router.post('/loginseller',forwardAuthenticated, sellerController.loginUser);

/* Seller Home page Get */
router.get('/sellerhome',ensureAuthenticated,sellerController.productlist);

/* Get product add */
router.get('/createproduct',ensureAuthenticated,sellerController.create);

/* Post product add */
router.post('/createproduct',ensureAuthenticated,sellerController.createProduct);

/* Get product update */
router.get('/updateproduct',ensureAuthenticated,sellerController.update);

/* Post product update */
router.post('/updateproduct',ensureAuthenticated,sellerController.updateProduct);

/*Get product delete */
router.get('/deleteproduct',ensureAuthenticated,sellerController.deleteProduct);

/* GET add profile */
router.get('/sellerprofile',ensureAuthenticated,sellerController.sellerProfile);

/* POST add profile */
router.post('/sellerprofile',ensureAuthenticated,sellerController.sellerProfileDetails);

/*Get Logout  */
router.get('/logout',ensureAuthenticated,sellerController.logout);


module.exports = router;