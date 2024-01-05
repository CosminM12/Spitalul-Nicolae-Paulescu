const jwt = require('jsonwebtoken');

const jwtSecret = "0a12236513769e4ccc70b032e6500ef93ae338583bd5ff32321aec65d0620e3ac20ff0";


exports.adminAuth = (req, res, next) => {
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

exports.userAuth = (req, res, next) => {
    const token = req. cookies.jwt;
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
}