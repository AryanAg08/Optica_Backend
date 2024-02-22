const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

module.exports.login = async (req, res) => {
    let { email, password } = req.body;
    if(!email || !password) res.status(400).json('missing fields');
    else{
        email = email.toLowerCase();
        const user = await User.findOne({ email: email});
        if(user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user._id, username: user.username, email: user.email}, `${process.env.SECRET}`, { expiresIn: '1h' });
            
            res.cookie('jwt', token, { signed: true,httpOnly: false, sameSite: 'none', maxAge: 1000 * 60 * 60,secure: true }).json('login');
        } 
        else {
            res.status(400).json('login failed');
        }
    }
}


module.exports.register = async (req, res) => {
    let { name, email, phoneNo, batch, enrollmentNo, branch } = req.body;
    email = email.toLowerCase();
    const registeredEmail = await User.findOne({email: email});


    if (!(email.includes("@" && "."))) {
        res.status(400).json('invalid email');
    }

    else if(registeredEmail){
        res.status(400).json('email already exists');
    }

    else{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const user = await User.create({name, email, phoneNo, batch, enrollmentNo, branch, password: hash});
        await sendVerificationEmail(email,user);
        res.json('register');
    }
}

module.exports.sendUserVerificationEmail = async (req, res) => {
    const { userid } = req.params;
    const user = await User.findOne({ _id: userid });

    if (!user) {
        return res.status(400).json('user not found');
    }

    if (user.verified) {
        return res.status(400).json('user already verified');
    }

    await sendVerificationEmail(user.email, user);
    return res.json('email sent');
};

const sendVerificationEmail = async (email,user) => {
    const secret = `${process.env.SECRET}`;
    const token = jwt.sign({ id: User._id } , secret , { expiresIn: '5m' });

    let config = {
        service: 'gmail',
        auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.PASSWORD}`
        }
    };
    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'MyApp',
            link: 'https://mailgen.js/'
        }

    });

    var response = {
        body: {
            name: `${user.username}`,
            intro: 'this is for the verification of the email you have provided',
            action: {
                instructions: 'Click the button below to verify the email:',
                button: {
                    color: '#DC4D2F',
                    text: 'Click here',
                    link: `${process.env.DOMAIN}/user/verifyEmail/${user._id}/${token}`
                }
            },
            outro: 'If you did not request a verification email, no further action is required on your part.'
        }
    };

    var emailBody = MailGenerator.generate(response);
    let message = {
        from: `${process.env.EMAIL}`,
        to: `${email}`,
        subject: 'Email Verification',
        html: emailBody
    };

    transporter.sendMail(message)
    .then(() => console.log('email sent'))
    .catch((err) => console.log(err));        

}


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


module.exports.logout = (req, res) => {
    res.clearCookie('jwt').json('logout');
};


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


module.exports.forgotPassword = async (req, res) => {
    const { email} = req.body;
    const user = await User.findOne({email: email});
    if(user){
        const secret = `${process.env.SECRET}${user.password}`;
        const token = jwt.sign({ id: user._id } , secret , { expiresIn: '5m' });

        let config = {
            service: 'gmail',
            auth: {
                user: `${process.env.EMAIL}`,
                pass: `${process.env.PASSWORD}`
            }
        };
        let transporter = nodemailer.createTransport(config);

        let MailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'MyApp',
                link: 'https://mailgen.js/'
            }

        });

        var response = {
            body: {
                name: 'John Appleseed',
                intro: 'You have received this email because a password reset request for your account was received.',
                action: {
                    instructions: 'Click the button below to reset your password:',
                    button: {
                        color: '#DC4D2F',
                        text: 'Click here',
                        link: `${process.env.DOMAIN}/user/resetpassword/${user._id}/${token}`
                    }
                },
                outro: 'If you did not request a password reset, no further action is required on your part.'
            }
        };

        var emailBody = MailGenerator.generate(response);
        let message = {
            from: `${process.env.EMAIL}`,
            to: `${email}`,
            subject: 'Password Reset Request',
            html: emailBody
        };

        transporter.sendMail(message)
        .then(() => res.status(201).json('email sent'))
        .catch((err) => res.status(400).json(err));
        
    } 
    else{
        res.status(400).json('email not registered');
    }
}


module.exports.resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
    const oldUser = await User.findById(id);
    if(!oldUser){
        res.status(400).json('user not found');
    }
    else{
        const secret = `${process.env.SECRET}${oldUser.password}`;
        if(jwt.verify(token,secret)){
            oldUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            await oldUser.save();
            res.json('password changed');
        }
        else{
            res.status(400).json('invalid token');
        }
    }

}