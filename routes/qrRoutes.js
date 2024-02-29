const router = require('express').Router();
const general = require('../controllers/qrController.js');
const { isLoggedIn, isVerified } = require('../middleware.js');
const catchAsync = require('../utils/CatchAsync.js');

router.route('/generateQRCode')
    .post(isLoggedIn, isVerified, catchAsync(general.generateQRCode));


router.route('/getQRCode')
    .post(isLoggedIn, catchAsync(general.getQRCode));


// router.route('/validateUser')
//     .post(catchAsync(general.validateUser));


module.exports = router;