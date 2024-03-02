const router = require("express").Router();
const new_user_model = require("../models/userModel");

router.get("/try", (req, res) => {
    res.send("this is route");
});

router.post("/register-new", async (req, res) => {
    console.log(req.body);

    res.json({ code: 200, status: "Message Sent"});
    const { name, email, phone, batch, enroll, branch } = req.body;
    
        const User_details = {
            name,
            email,
            phoneNo: phone,
            batch,
            enrollmentNo: enroll,
            branch
         }
        console.log(User_details);
        const save_data = await new new_user_model(User_details).save().then(() => {
            console.log("User data saved in the database!!");
        })
     
});

module.exports = router;