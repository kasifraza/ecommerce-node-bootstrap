const User = require('../models/backend/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const isApiUser = async (req, resp, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        jwt.verify(token, process.env.JWT_SECRET,async (error, decoded) => {
            if (error) {
                return resp.status(401).json({ status: false, message: 'Unauthorized User' });
            }
            else {
                const user = await User.findById(decoded.user.id);
                if (user && user.role === 'user') {
                    req.session.user = user;
                    req.userData = user;
                    return next();
                }
                else {
                    return resp.status(400).json({ status: false, message: 'User Does not Exist' });
                }
            }
        });
    }
    else {
        return resp.status(401).json({ status: false, message: 'Unauthorized User Please Login' });
    }
}
module.exports = isApiUser;
