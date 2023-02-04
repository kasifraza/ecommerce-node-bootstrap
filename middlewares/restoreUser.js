const User = require('../models/backend/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const isRestore = async (req, resp, next) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET,async (error, decoded) => {
        if (error) {
            return resp.status(401).json({ status: false, message: 'Unauthorized User' });
        }
        else {
            const user = await User.findById(decoded.user.id);
            if (user) {
                req.session.user = user;
            }
        }
    });
}
module.exports = isRestore;
