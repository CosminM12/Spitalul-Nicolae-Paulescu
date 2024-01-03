/*


const uri = 'mongodb+srv://murariurusalincosmin:Moisil123@nicolaepaulescu.nejcjki.mongodb.net/NodeAPI?retryWrites=true&w=majority'

mongoose.set('strictQuery', false);

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
        app.listen(3000, () => {
            console.log("App listening on port 3000");
        });
    } catch(error) {
        console.error(error);
    }
}

connect();

app.use(/*'/web',express.static(path.join(__dirname, '/public')));

app.use((req, res) => {
    res.status(404);
    res.send('<h1>Error 404: File not found</h1>');
})
*/

const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const morgan = require('morgan');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

var port = process.env.PORT || 3000;
var dbConfig = require('./config/database.js'); //db configuration

const passport = require('passport'); //->passport


const app = express();

mongoose.connect(dbConfig.url); //db conneciton

require('./config/passport')(passport); //->passport

app.use(morgan('dev'));
app.use(cookieParser());   /**/
app.use(bodyParser.json()); //get info from html forms
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs'); //set ejs as template

app.use(session({
    secret: 'thisisasecret',
    resave: true,
    saveUninitialized: false
}));

app.use(flash()); //flash connection

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
//require('./app/routes.js')(app, passport);



///////NORMAL ROUTES ////////
app.get('/', (req, res) => {                  //home
    res.render('index.ejs');
});

app.get('/profile', isLoggedIn, function(req, res){     //profile page
    res.render('profile.ejs', {
        user : req.user
    });
});

app.get('/logout', function(req, res) {            //log out
    req.logout();
    res.redirect('/');
});

////LOGIN////
app.get('/login', function(req,res) {
    res.render('login.ejs', {message: req.flash('loginMessage')});
});
app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
}));


////REGISTER////
app.get('/signup', function(req, res) {
    res.render('register.ejs', {message: req.flash('signupMessage')});
});
app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
}));

////CHANGE ACCOUNT////
app.get('connect/local', function(req, res) {
    res.render('connect-local.ejs', {message: req.flash('loginMessage')});
});
app.post('connect/local', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : 'connect/local',
    failureFlash : true
}));

////LOG OUT (UNLINK ACCOUNT)////
app.get('unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
        res.redirect('/profile');
    });
});


/////functions/////
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}



///port setup
app.listen(port, () => {
    console.log('App listening on port ' + port);
});