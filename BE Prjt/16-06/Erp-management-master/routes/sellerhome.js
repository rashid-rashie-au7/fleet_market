var express = require('express');
var router = express.Router();
var productcontroller = require('../controller/PrdtController');

router.get('/seller',productcontroller.productlist);

router.get('/product',productcontroller.create);

router.post('/product',productcontroller.createProduct);

router.get('/update',productcontroller.update);

router.post('/update',productcontroller.updateProduct);

router.get('/delete',productcontroller.delete);





module.exports = router;