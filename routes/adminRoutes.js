const router = require('express').Router();
const catchAsync = require('../utils/CatchAsync');
const admin = require('../controllers/adminController.js');
const {isAdmin} = require('../middleware.js');


router.route('/login')
    .get(admin.renderLogin)
    .post(catchAsync(admin.adminlogin));

router.route('/logout')
    .get(catchAsync(admin.adminlogout));

router.route('/users')
    .get(isAdmin, catchAsync(admin.allUsers));

router.route('/users/:id')
    .get(isAdmin, catchAsync(admin.getUser))
    .delete(isAdmin, catchAsync(admin.deleteUser));

router.route('/search/:name')
    .get(isAdmin, catchAsync(admin.searchUser));


router.route('/delete/:id')
    .delete(isAdmin, catchAsync(admin.deleteUser));

router.route('/verifyTicket/:ticketid')
    .post(isAdmin, catchAsync(admin.validateTicket));

//temporarily added
router.route('/home')
    .get(isAdmin, catchAsync(admin.adminHome));

router.route('/register')
    .get(admin.renderRegister)
    .post(catchAsync(admin.adminregister));

module.exports = router;