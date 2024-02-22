const User = require('./models/userModel')
const jwt = require('jsonwebtoken');
const admin = require('./models/adminModel');

module.exports.isLoggedIn = async  (req, res, next) => {   
    const token = req.signedCookies.jwt;
    if(token){
        const decoded = jwt.verify(token, `${process.env.SECRET}`);
        const user = await User.findById(decoded.id);
        if(user) next();
        else res.status(400).json('invalid token');
    }
    else{
        res.status(400).json('no token');
    }
}


module.exports.isVerified = async (req, res, next) => {
    const token = req.signedCookies.jwt;
    if(token){
        const decoded = jwt.verify(token, `${process.env.SECRET}`);
        const user = await User.findById(decoded.id);
        if(user.verified) next();
        else res.status(400).json('not verified');
    }
    else{
        res.status(400).json('no token');
    }
}


module.exports.isAdmin = async (req, res, next) => {
    const token = req.signedCookies.jwt;
    if(token){
        const decoded = jwt.verify(token, `${process.env.SECRET}`);
        const Admin = await admin.findById(decoded.id);
        if(Admin) next();
        else res.status(400).json('not admin');
    }
    else{
        res.status(400).json('no token');
    }
}

