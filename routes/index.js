const router = require("express").Router();
const new_user_model = require("../models/userModel");
const cloudinary = require("../utils/cloudinary")
router.get("/try", (req, res) => {
    res.send("this is route");
});

router.post("/register-new", async (req, res) => {
    console.log(req.body);

   // res.json({ code: 200, status: "Message Sent"});
     const { name, email, phone, batch, enroll, branch, image } = req.body;
     try {
        const result = await cloudinary.uploader.upload(image, {
            folder: "jscop",
        });

        const User_details = {
            name,
            email,
            phoneNo: phone,
            batch,
            enrollmentNo: enroll,
            branch,
            payment: {
                public_id: result.public_id,
                url: result.secure_url
            }
         }
        console.log(User_details);
        const save_data = await new new_user_model(User_details).save().then(() => {
           console.log("User data saved in the database!!");
          
       });
        res.status(201).json({
            success: true,
          User_details
        });
     } catch (err) {
        console.log(err);
     }
     
});

router.get("/verify", async (req, res) => {
 try {
    const Users = await  new_user_model.find({
        verified: false,
    });
    if (Users.length < 1) {
        return res.status(404).json({ msg: 'There are no unverified users' });
 }
 console.log(Users);
 res.json(Users);
}catch (err) {
    console.log(err);
}
});

router.get("/Verified-users", async (req, res) => {
    try {
        const Users = await new_user_model.find({
            verified: true,
        });
        if (Users.length < 1) {
            return res.status(404).json({ msg: "No verified User!!"});
        }
        res.json(Users);
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;