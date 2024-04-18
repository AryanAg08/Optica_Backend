const router = require('express').Router();
const catchAsync = require('../utils/CatchAsync');
const admin = require('../controllers/adminController.js');
const {isAdmin} = require('../middleware.js');


router.route('/login')
    .post(catchAsync(admin.adminlogin));

router.route('/logout')
    .get(catchAsync(admin.adminlogout));

router.route('/allUsers')
    .get(catchAsync(isAdmin), catchAsync(admin.getAllUsers));

router.route('/user/:id')
    .get(isAdmin, catchAsync(admin.getUser))
    .delete(isAdmin, catchAsync(admin.deleteUser));

// (same delete as above)
// router.route('/delete/:id')
//     .delete(isAdmin, catchAsync(admin.deleteUser));
    
router.route('/search/:name')
    .get(isAdmin, catchAsync(admin.searchUser));
    //this is by name only further we can do by email or enrollment number

router.route('/verifyTicket/:ticketid')
    .post(isAdmin, catchAsync(admin.validateTicket));





module.exports = router;