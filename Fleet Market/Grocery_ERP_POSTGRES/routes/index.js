var express = require('express');
var router = express.Router();
const userController  = require('../controller/userController');

/* GET home page. */
router.get('/',usercontroller.index);

module.exports = router;
