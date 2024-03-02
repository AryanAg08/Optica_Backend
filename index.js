const express = require('express')
const app = express();
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const ExpressError = require('./utils/ExpressError');
const cookieParser = require('cookie-parser');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const dbURL = process.env.mongo;
const bodyParser = require('body-parser');
const port = process.env.PORT || 4000;
mongoose.connect(dbURL);


const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))

app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use (cookieParser(process.env.SECRET));
app.use(express.json());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

const general = require('./routes/qrRoutes');
app.use('/', general); 

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const admin = require('./routes/adminRoutes');
app.use('/admin', admin);


const mailRoute = require('./routes/mailRoutes');
app.use('/sendMail', mailRoute);

const registerRoute = require("./routes/index");
app.use("/api", registerRoute);



app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).json({ message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})