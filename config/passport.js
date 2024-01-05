var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user'); //load user model

//var configAuth = require('./auth');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function(id, done) {
        /*User.findById(id, function(err, user) {
            done(err, user);
        });*/
        User.findById(id).catch(err => {
            done(err, user);
        })
    });

////LOCAL-LOGIN
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true //can check after if user is logged in
    },
    function(req, email, password, done) {
        if(email)
            email = email.toLowerCase();

        process.nextTick(function() {
            User.findOne({'local.email' : email}).then(user => {
                if(!user)
                    return done(null, false, req.flash('loginMessage', 'No user found'));
                if(!user.validPassword(password))
                    return done(null ,false, req.flash('loginMessage', 'Wrong password'));
                else
                    return done(null, user);
                })
            .catch(err => {
                return done(err);
            });
        });
    }));


////LOCAL SIGNUP
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        if(email)
            email = email.toLowerCase();

        process.nextTick(function() {
            if(!req.user) {
                User.findOne({'local.email' : email}).then(user => {
                    if(user){
                        return done(null, false, req.flash('signupMessage', 'That email is already taken'));
                    }
                    else {
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save().then(newUser => {
                            return done(null, newUser);
                        })
                        .catch(err => {
                            return done(err);
                        })
                    }
                    })
                    .catch(err => {
                        return done(err);
                    });
            }
            else if(!req.user.local.email) {
                User.findOne({ 'local.email' :  email }).then(user => {
                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                return done(err);
                            
                            return done(null,user);
                        });
                    }
                })
                .catch(err => {
                    return done(err);
                });
            } else {
                return done(null, req.user);
            }
        });
    }));
}