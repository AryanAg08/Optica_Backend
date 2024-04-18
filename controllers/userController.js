const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');


module.exports.verifyUser = async (req, res) => {
    const { userid, token } = req.params;
    const user = await User.findById(userid);

    if(!user){
        return res.status(400).json('user not found');
    }

    else{
        const secret = `${process.env.SECRET}`;
        if(jwt.verify(token,secret)){
            user.verified = true;
            await user.save();
            res.render('verifyEmail');
        }
        else{
            return res.status(400).json('invalid token');
        }
    }
}


module.exports.profile = async (req, res) => {
    const token = req.signedCookies.jwt;
    if(token){
        const decoded = jwt.verify(token, `${process.env.SECRET}`);
        const user = await User.findById(decoded.id);
        res.json(user);
    }
    else{
        res.status(400).json('no token');
    }
}


