///////DEFINITIONS
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');

const path = require('path');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const session = require('express-session');

///////Database Configuration
const connectDB = require('./config/database.js');

///////Schema Configuration
const User = require("./app/models/user.js");
const Appointment = require('./app/models/appointment.js');

///////Port Configuration
var port = process.env.PORT || 3000;

///////SET UP MIDDLEWARES///////
const app = express(); //open server
app.use(express.json()); //use middleware
connectDB(); //connect to database

app.use(session({
    secret: 'hospitalweb/devMaintain',
    resave: true,
    saveUninitialized: false
}));
app.use(flash());
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');


///////FUNCTION DECLARATIONS///////
const {authenticate, isLoggedIn} = require("./config/specialAuth.js");

///////SIGN IN / SIGN UP SPECIAL METHODS///////
app.use("/api/auth", require("./app/routes.js"));

///////FETCH DATA///////
///////Get methods
app.get("/api/doctors", async (req, res) => {
    try {
        const {department} = req.query;
        const doctors = await User.find({department});
        res.json(doctors);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.get("/api/appointments", async (req, res) => {
    try {
        const {validatedDate, doctorId} = req.query;
        if(!validatedDate || !doctorId) {
            return res.status(400).json({error: 'Missing required parameters'});
        }
        const appointments = await Appointment.find({date:validatedDate, doctorId});
        res.json(appointments);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// app.get("/api/appointments/user", async(req, res) => {
//     try {
//         const {currentUserName} = req.query;
//         const decodedUserName = decodeURIComponent(currentUserName);
//         if(!decodedUserName) {
//             return res.status(400).json({error: 'Missing userId in appointmnet'});
//         }
//         const parts = decodedUserName.split(' ');
//         const firstName = parts[0];
//         const lastName = parts[1];
//         const user = await User.findOne({firstName, lastName});
//         res.json(user);
//     }
//     catch(err) {
//         res.status(500).json({error: err.message});
//     }
// });

// app.get("/api/appointments/doctors", async (req, res) => {
//     try {
//         const doctorId = req.query;
//         if(!doctorId) {
//             return res.status(400).json({error: 'Missing doctorId in appointment'});
//         }
//         const doctor = await User.findById(doctorId);
//         res.json(doctor);
//     } catch(err) {
//         res.status(500).json({error: err.message});
//     }
// });

///////Post methods
app.post("/api/appointments", authenticate, isLoggedIn, async (req, res) => {
    try {
        const {doctorId, userId, date, time, message, telephone} = req.body;
        const newAppointment = new Appointment({
            doctorId,
            userId,
            date,
            time,
            message,
            telephone
        });

        await newAppointment.save();
        res.redirect("/");
    } catch(err) {
        console.error('Error creating and saving the appointment: ', err);
        res.status(500).json({success: false, error: 'Failed to create and save appointment'});
    }
});



//normal routes
app.get("/", authenticate, (req, res) => {
    res.render("home.ejs", {role: req.user ? req.user.role : null});
});
app.get("/programare", authenticate, isLoggedIn, (req, res) => {
    res.render("programare.ejs", {role : req.user ? req.user.role : null, user: req.user || null});
});

app.get("/misiune", authenticate,(req, res) => {
    res.render("misiune.ejs", {role: req.user ? req.user.role : null});
});

app.get("/anunturi", authenticate, (req, res) => {
    res.render("anunturi.ejs", {role: req.user ? req.user.role : null});
});

app.get("/concursuri", authenticate, (req, res) => {
    res.render("concursuri.ejs", {role: req.user ? req.user.role : null});
});

app.get("/departamente", authenticate, (req, res) => {
    res.render("departamente.ejs", {role: req.user ? req.user.role : null});
});

app.get("/imagini", authenticate, (req, res) => {
    res.render("slideshow.ejs", {role: req.user ? req.user.role : null});
});

app.get("/cardiologie", authenticate, (req, res) => {
    res.render("cardiologie.ejs", {role: req.user ? req.user.role : null});
});

app.get("/neurologie", authenticate, (req, res) => {
    res.render("neurologie.ejs", {role: req.user ? req.user.role : null});
});

app.get("/chirurgie", authenticate, (req, res) => {
    res.render("chirurgie.ejs", {role: req.user ? req.user.role : null});
});

app.get("/radiologie", authenticate, (req, res) => {
    res.render("radiologie.ejs", {role: req.user ? req.user.role : null});
})

app.get("/contact", authenticate, (req, res) => {
    res.render("contact.ejs", {role: req.user ? req.user.role : null});
});

app.get("/register", (req, res) => res.render("register.ejs"));
app.get("/login", (req, res) => res.render('login.ejs'));

///////PROFILE PAGES///////
app.get("/doctor", authenticate, isLoggedIn, async (req, res) => {
    try {
        const doctorId = req.user.id;
        const loggedUser = await User.findById(doctorId);
        
        const doctorName = loggedUser.firstName + " " + loggedUser.lastName;
        const appointments = await Appointment.find({doctorId: doctorName});

        res.render("doctor_profile.ejs", {loggedUser, appointments});
    } catch(err) {
        console.error('Error fetching and rendering appointments:', err);
        res.status(500).json({success: false, error: 'Failed to fetch and render appointments'});
    }
});

app.get("/admin", authenticate, isLoggedIn, async (req, res) => {
    try {
        const adminId = req.user.id;
        const appointments = await Appointment.find({});
        const loggedUser = await User.findById(adminId);
        res.render("admin_profile.ejs", {loggedUser, appointments});
    } catch (err) {
        console.error('Error fetching and rendering appointments: ', err);
        res.status(500).json({success: false, error: 'Failed to fetch and render appointments'});
    }
});



app.get("/logout", (req, res) => {
    res.cookie("jwt", "", {maxAge: "1"});
    res.redirect("/");
})

app.use((req, res) => {
    res.status(404);
    res.render("page_not_found.ejs");
});

app.listen(port, () => {
    console.log('App listening on port ' + port);
})
