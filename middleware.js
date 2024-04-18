const User = require('./models/userModel')
const jwt = require('jsonwebtoken');
const admin = require('./models/adminModel');

module.exports.isAdmin = async (req, res, next) => {
    console.log("Admin Check!!");
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

