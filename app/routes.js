/*

////LOG IN METHODS////
router.get('/login', (req, res) => {
    res.render('login.ejs');
});
router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: 'Invalid email or password. Please try again'
}));

////SING IN METHODS////
router.get('/signup', (req, res) => {
    res.render('register.ejs');
});
router.post('/signup', (req, res) => {
    let {email, password} = req.body;

    let userData = {
        email : email,
    };

    User.register(userData, password, (err, user) => {
        if(err) {
            req.flash('error_msg', 'ERROR: ' + err);
            res.redirect('/signup');
        }
        passport.authenticate('local') (req, res, () => {
            req.flash('successs_msg', 'Account created successfully');
            res.redirect('/login');
        });
    });
});

////LOG OUT METHODS////
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You have been logged out');
    res.redirect('/login');
})

router.get('/profile', isAuthenticatedUser ,(req,res) => {
    res.render('profile.ejs');
});

router.get('/home', (req, res) => {
    res.render('home.ejs');
});

//functions
//checck if authenticated
function isAuthenticatedUser(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please login first to access this page');
    req.redirect('/login');
} 


module.exports = router;*/

const express = require('express');
const router = express.Router();

// const { authenticate } = require("../config/specialAuth.js");
const { register, login, update } = require("../config/auth.js");
const { adminAuth } = require("../config/specialAuth.js");

// router.route("/").get(authenticate);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update").put(update);


router.route("/update").put(adminAuth, update);
//router.route("/deleteUser").delete(AdminAuth, deleteUser);

module.exports = router;

