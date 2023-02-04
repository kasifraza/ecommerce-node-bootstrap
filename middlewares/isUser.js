const User = require('../models/backend/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const isUser = async (req, resp, next) => {
    const token = req.cookies.token;
    if (typeof token !== "undefined") {
        jwt.verify(token, process.env.JWT_SECRET,async (error, decoded) => {
            if (error) {
                return resp.status(401).json({ status: false, message: 'Unauthorized User' });
            }
            else {
                const user = await User.findById(decoded.user.id);
                if (user) {
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
module.exports = isUser;
