const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../app/models/user.js");

const jwtSecret = "0a12236513769e4ccc70b032e6500ef93ae338583bd5ff32321aec65d0620e3ac20ff0";

exports.register = async (req, res, next) => {
    const {username, firstName, lastName, telephone, password, passwordConfirmation} = req.body;
    if(password.length < 6) {
        return res.status(400).json({message: "Password must be at least 6 characters long"});
    }
    if(password == passwordConfirmation) {
        bcrypt.hash(password, 10).then(async (hash) => {
            await User.create({username, firstName, lastName, telephone, password: hash})
                .then((user) => {
                    const maxAge = 3 * 60 * 60; //3hrs in sec
                    const token = jwt.sign({id:user._id, username, role:user.role}, jwtSecret, {expiresIn: maxAge});
                    res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge*1000});
                    res.status(201).json({message:"User created successfully", user: user._id});
                })
                .catch((error) => {
                    res.status(400).json({message: "User could not be created", error: error.message});
                });
        });
    }
    else {
        return res.status(400).json({message: "Passwords must match"});
    }
}

exports.login = async (req, res, next) => {
    const {username, password} = req.body;

    if(!username) {
        res.status(400).json({message: "Username must be provided"});
    } else if(!password) {
        res.status(400).json({message: "Password must be provided"});
    }

    try {
        const user = await User.findOne({username});
        if(!user) {
            res.status(400).json({message: "Login not successful", error:"User not found"});
        } else {
            bcrypt.compare(password, user.password).then(function(result) {
                if(result) {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign({id: user._id, username, role: user.role}, jwtSecret, {expiresIn: maxAge});
                    res.cookie("jwt", token, {httpOnly:true, maxAge: maxAge*1000});
                    res.status(201).json({message: "Login successful", user: user._id});
                    //res.redirect("/");
                }
                else {
                    res.status(400).json({message: "Login not successful"});
                }
            })
        }
    }
    catch(error) {
        res.status(400).json({message: "An error occurred", error: error.message});
    }
}


exports.update = async (req, res, next)  => {
    const {role, id} = req.body;
    if(role && id) {
        if(role == "Admin") {
            await User.findById(id).then((user) => {
                if(user.role !== "Admin") {
                    user.role = role;
                    user.save((err) => {
                        if(err) {
                            res.status(400).json({message: "An error occurred", error: error.message});
                            process.exit(1);
                        }
                        res.status(201).json({message: "Update successful", user});
                    })
                }
                else {
                    res.status(400).json({message: "User is already an Admin"});
                }
            }).catch((error) => {
                res.status(400).json({message: "An error occurred", error: error.message});
            });
        }
        else {
            res.status(400).json({message: "Role is not admin"});
        }
    }
    else {
        res.status(400).json({message: "Role or Id not present"});
    }
}

exports.getUsers = async (req, res, next) => {
    await User.findById({}).then(users => {
        const userFunction = users.modifiedPaths(user => {
            const container = {};
            container.username = user.username;
            container.role = user.role;
            return container;
        });
        res.status(200).json({user: userFunction});
    }).catch(err => res.status(401).json({message: "Not successful", error: err.message}));
}