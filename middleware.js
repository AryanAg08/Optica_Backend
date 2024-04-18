const User = require('./models/userModel')
const jwt = require('jsonwebtoken');
const admin = require('./models/adminModel');
const Volunteer = require('./VolunteerData');

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


module.exports.isVolunteer = async (req, res, next) => {
    console.log("Volunteer Check!!");
    const token = req.signedCookies.jwt;
    if(token){
        const decoded = jwt.verify(token, `${process.env.SECRET}`);
        const volunteer = Volunteer.find(volunteer => volunteer.email === decoded.email);
        if(volunteer) next();
        else res.status(400).json('not volunteer');
    }
    else{
        res.status(400).json('no token');
    }
}
