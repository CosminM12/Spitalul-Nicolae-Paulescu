const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');

const path = require('path');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const session = require('express-session');

const connectDB = require('./config/database.js');

const User = require("./app/models/user.js");
const Appointment = require('./app/models/appointment.js');

var port = process.env.PORT || 3000;

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

app.use("/api/auth", require("./app/routes.js"));


const {authenticate, authAndLogIn} = require("./config/specialAuth.js");
const {isLoggedIn} = require("./config/specialAuth.js");
// const {getAppointments, postAppointment} = require("./config/appointmentSystem.js");


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

/*app.get("/api/doctor/apppointments", async (req, res) => {
    try {
        const {doctorId} = req.query;
        if(!doctorId) {
            return res.status(400).json({error: 'Missing required paramenter'});
        }
        const appointments = await Appointment.find({doctorId: doctorId});
        res.json(appointments);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});*/

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
        // res.status(201).json({success: true, message: 'Appointment saved successfully'});
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
    res.render("programare.ejs", {user: req.user || null});
});

app.get("/misiune", authenticate,(req, res) => {
    res.render("misiune.ejs", {role: req.user ? req.user.role : null});
})

app.get("/register", (req, res) => res.render("register.ejs"));
app.get("/login", (req, res) => {
    res.render('login.ejs');
});

///PROFILE PAGES
app.get("/doctor", authenticate, isLoggedIn, async (req, res) => {
    try {
        console.log(req.user);
        const doctorId = req.user._id;
        const appointments = await Appointment.find({doctorId});

        res.render("doctor_profile.ejs", {user: req.user || null, appointments});
    } catch(err) {
        console.error('Error fetching and rendering appointments:', err);
        res.status(500).json({success: false, error: 'Failed to fetch and render appointments'});
    }
});

// app.get("/admin", adminAuth, (req, res) => res.render('admin.ejs'));
// app.get("/basic", userAuth, (req, res) => res.render('user.ejs'));



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
