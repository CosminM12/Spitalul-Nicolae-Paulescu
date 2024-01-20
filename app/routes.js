/*

router.get('/profile', isAuthenticatedUser ,(req,res) => {
    res.render('profile.ejs');
});

router.get('/home', (req, res) => {
    res.render('home.ejs');
});*/



const express = require('express');
const router = express.Router();

const { register, login, update } = require("../config/auth.js");

// router.route("/").get(authenticate);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update").put(update);

//router.route("/update").put(adminAuth, update);
//router.route("/deleteUser").delete(AdminAuth, deleteUser);

module.exports = router;

