const user = require('../models/userModel');
const qrCode = require('../models/qrCodeModel');
const { v4: uuidv4 } = require('uuid')
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const QRCode = require('qrcode');
const tickettemPlate = require('../mail/templates/tickettemplate');


//creating ticket and sending it to Email
module.exports.generateQRCode = async (req, res) => {
    const { username, email } = req.body;
    const qr_id = uuidv4()
    if (!username || !email) {
        return res.status(400).send('Please enter all fields');
    }

    const userfound = await user.findOne({ email });
    const exisitingUser = await qrCode.findOne({ user: userfound._id }); 
    if (exisitingUser) {
        return res.status(400).send('User already has a QR Code');
    } 

    if (userfound) {
        owner = userfound._id;
        const newQrCode = new qrCode({ user: owner, qr_id });
        await newQrCode.save();
        await sendTicket(email,qr_id);
        res.status(201).json("QR Code generated successfully");
    }
    
    else {
        res.status(400).send('User does not exist');
    }

};


const sendTicket = async (email,qr_id) => {

    let config = {
        service: 'gmail',
        auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.PASSWORD}`
        }
    };

    const finalqrid = `${process.env.DOMAIN}/admin/sendOTP/${qr_id}`

    const qrCodeimg = await QRCode.toDataURL(finalqrid, {
                        width: 400,
                        margin: 2,
                        color: {
                            dark: '#335383FF',
                            light: '#EEEEEEFF'
                        }})


    let transporter = nodemailer.createTransport(config);    
    const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: `${email}`,
        subject: 'Your Ticket For the event is here', // subject
        html: tickettemPlate(),
        attachments: [
            {   
              filename: 'ticket.png',
              content: qrCodeimg.split("base64,")[1],
              encoding: 'base64'
            }
          ]
    };

    transporter.sendMail(mailOptions)
    .then(() => console.log('email sent'))
    .catch((err) => console.log(err));    
}


//frontend getting ticket
module.exports.getQRCode = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).send('Please enter all fields');
    }

    const found = await user.findOne({ email });

    if (!found) {
        res.status(400).send('User does not exist');
    }
    else{
        const qrCodeUser = await qrCode.findOne({ user: found._id });
        if(qrCode){
            const ticketurl = `${process.env.DOMAIN}/admin/sendOTP/${qrCodeUser.qr_id}`
            res.status(200).json(ticketurl);
        }
        else{
            res.status(400).send('User does not have a QR Code');
        }  
        
    }
}


//validating ticket by sending OTP on email and creating a page for employee for validating ticket


