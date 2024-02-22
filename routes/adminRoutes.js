const router = require('express').Router();
const catchAsync = require('../utils/CatchAsync');
const admin = require('../controllers/adminController.js');
const {isAdmin} = require('../middleware.js');


router.route('/adminlogin')
    .get(admin.renderLogin)
    .post(catchAsync(admin.adminlogin));

router.route('/adminregister')
    .get(admin.renderRegister)
    .post(catchAsync(admin.adminregister));

router.route('/adminlogout')
    .get(catchAsync(admin.adminlogout));


router.route('/home')
    .get(isAdmin, catchAsync(admin.adminHome));

router.route('/sendOTP/:ticketid')
    .get(isAdmin, catchAsync(admin.renderOTP))
    .post(isAdmin, catchAsync(admin.sendOTP));

router.route('/verifyOTP')
    .post(isAdmin, catchAsync(admin.validateTicket));

module.exports = router;