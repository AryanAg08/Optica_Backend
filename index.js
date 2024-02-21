require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/index");

mongoose.connect(process.env.mongo).then(() => {
    console.log("connected to the mongo!!");
});

app.use(express.json());


app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use("/api", routes);
app.get("/", async (req, res) => {
    res.json("Hello world");
});

app.listen(port, () => {
    console.log(`Listening to the port ${port}`);
});