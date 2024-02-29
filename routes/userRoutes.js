const router = require('express').Router();
const user  = require('../controllers/userController.js');
const catchAsync = require('../utils/CatchAsync.js');
const { isLoggedIn } = require('../middleware.js');


router.route('/login')
    .post(catchAsync(user.login));
        
router.route('/register')
    .post(catchAsync(user.register));

router.route('/sendverificationEmail/:userid')
    .post(catchAsync(user.sendUserVerificationEmail));

//verified itself on a page that opens after clicking the button in users mail (not required on the website)
router.route('/verifyEmail/:userid/:token')
    .get(catchAsync(user.verifyUser));


router.route('/logout')
    .get(catchAsync(user.logout));

router.route('/forgotpassword')
    .post(catchAsync(user.forgotPassword));

//Reset itself on a page that opens after clicking the button in users mail (not required on the website)
router.route('/resetpassword/:id/:token')
    .post(catchAsync(user.resetPassword));


router.route('/profile')
    .get(isLoggedIn, catchAsync(user.profile));


module.exports = router;