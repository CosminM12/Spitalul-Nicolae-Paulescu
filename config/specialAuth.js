const jwt = require('jsonwebtoken');

const jwtSecret = "0a12236513769e4ccc70b032e6500ef93ae338583bd5ff32321aec65d0620e3ac20ff0";

exports.authAndLogIn = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token) {
        try {
            const user = jwt.verify(token, jwtSecret);
            req.user = user;
        } catch(err) {
            return res.status(403).json({message:"Not authorized"});
        }
    }

    next();
}

exports.authenticate = (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token) {
        return next();
    }
    try {
        const user = jwt.verify(token, jwtSecret);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({message: "Not authorized"});
    }

};

exports.isLoggedIn = (req, res, next) => {
    if(req.user) {
        return next();
    }
    else {    
        return res.redirect("/login");
    }
};



/*exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err) {
                return res.status(401).json({message: "Not authorized"});
            }
            else {
                if(decodedToken.role !== 'Admin') {
                    return res.status(401).json({message: "Not authorized"});
                }
                else {
                    next();
                }
            }
        })
    }
    else {
        return res.status(401).json({message: "Not authorized, token not available"});
    }
}

exports.doctorAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err) {
                return res.status(401).json({message: "Not authorized"});
            }
            else {
                if(decodedToken.role != "Doctor") {
                    return res.status(401).json({message: "Not authorized"});
                }
                else {
                    next();
                }
            }
        })
    }
    else {
        return res.status(401).json({message: "Noot authorized, token not available"});
    }
}

exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err) {
                return res.status(401).json({message: "Not authorized"});
            }
            else {
                if(decodedToken.role !== "Basic") {
                    return res.status(401).json({message: "Not authorized"});
                }
                else {
                    next();
                }
            }
        })
    }
    else {
        return res.status(401).json({message: "Not authorized, token not available"});
    }
}*/