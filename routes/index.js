const router = require("express").Router();
const new_user_model = require("../models/userModel");

router.get("/try", (req, res) => {
    res.send("this is route");
});

router.post("/register-new", async (req, res) => {
    console.log(req.body);

    res.json({ code: 200, status: "Message Sent"});
    const { Name, Email, PhoneNo, Batch, Enrollment, Branch } = req.body;
      if (Email.includes("@" && ".")) {
        const User_details = {
            name: Name,
            email: Email,
            phoneNo: PhoneNo,
            batch: Batch,
            enrollmentNo: Enrollment,
            branch: Branch
         }
        console.log(User_details);
        const save_data = await new new_user_model(User_details).save().then(() => {
            console.log("User data saved in the database!!");
        })
      }
      else {
       return  console("Unable to verify the email!!");
      }
     
});

module.exports = router;