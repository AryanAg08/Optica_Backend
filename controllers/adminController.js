const qrCode = require('../models/qrCodeModel');
const User = require('../models/adminModel');
const generalUsers = require('../models/userModel');
const sendMail = require('../utils/mailSender');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



// Home
module.exports.adminHome = async (req, res) => {
    const users = await generalUsers.find({});
    res.render('admins/index', { users });
}




// Login
module.exports.renderLogin = (req, res) => {
    res.render('admins/login');
}

module.exports.adminlogin = async (req, res) => {
    let { email, password } = req.body;
    if(!email || !password) res.status(400).json('missing fields');
    else{
        email = email.toLowerCase();
        const user = await User.findOne({ email: email});
        if(user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user._id }, `${process.env.SECRET}`, { expiresIn: '3h' });
            res.cookie('jwt', token, { signed: true, maxAge: 1000 * 60 * 60 }).redirect('/admin/home');
        } 
        else {
            res.status(400).json('login failed');
        }
    }
}


// Register
module.exports.renderRegister = (req, res) => {
    res.render('admins/register');
}

module.exports.adminregister = async (req, res) => {
    let { username, email, password } = req.body;
    email = email.toLowerCase();
    const registeredEmail = await User.findOne({email: email});

    if(registeredEmail){
        res.status(400).json('email already exists');
    }

    else{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const user = await User.create({username, email, password: hash});
        res.json('register');
    }
}


// Logout
module.exports.adminlogout = (req, res) => {
    res.clearCookie('jwt').json('logout');
};


// Ticket Validation
module.exports.validateTicket = async (req, res) => {
    const {ticketid} = req.params;
    

    const ticketFound = await qrCode.findOne({ qr_id: ticketid });
    if (!ticketFound) {
        return res.status(400).send('Invalid Ticket ID');
    }

    const user = await ticketFound.populate('user');
    if (!user) {
        return res.status(400).send('User not found');
    }

    const email = user.user.email;

    if (found.email !== email) {
        return res.status(400).send('Invalid OTP');
    }

    const qrCodeUser = await qrCode.findOne({ user: user.user._id });
    if (!qrCodeUser) {
        return res.status(400).send('User does not have a QR Code');
    }

    if(qrCodeUser.redeemed_count >= 2){
        return res.status(400).send('Ticket already redeemed twice');
    }
    qrCodeUser.redeemed_count += 1;
    qrCodeUser.reedeemed_timestamp = Date.now();
    await qrCodeUser.save();
    sendMail(email, 'Ticket Validated', `Your ticket has been validated successfully and redeemed ${qrCodeUser.redeemed_count} times.`);
    res.json("Ticket validated successfully");
}







