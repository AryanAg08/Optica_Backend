const router = require("express").Router();
const new_user_model = require("../models/userModel");
const cloudinary = require("../utils/cloudinary")

router.get("/try", (req, res) => {
    res.send("this is route");
});

router.post("/register-new", async (req, res) => {
    console.log(req.body);

     const { name, email, phone, batch, enroll, enrollmentType, branch, college, image } = req.body;
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
            enrollmentType,
            verified: false,
            college,
            payment: {
                public_id: result.public_id,
                url: result.secure_url
            }
         }
        console.log(User_details);
        await new new_user_model(User_details).save().then(() => {
           console.log("User data saved in the database!!");
           res.status(201).json({
            success: true,
          User_details
        });
       });
        
     } catch (err) {
        console.log(err);
     }
     
});

module.exports = router;