const User = require('../models/backend/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const isAdmin = async (req, resp, next) => {
    if(req.session.admin){
        return next();
    }
        const token = req.cookies.adminToken;
        if (typeof token !== "undefined") {
            jwt.verify(token, process.env.JWT_SECRET,async (error, decoded) => {
                if (error) {
                    req.session.message = {
                        type : "error",
                        message : "You are not authorized to perform this action"
                    };
                    return resp.redirect('/admin/login');
                }
                else {
                    const user = await User.findById(decoded.user.id);
                    if (user) {
                        req.session.admin = user;
                        return next();
                    }
                    else {
                        req.session.message = {
                            type : "error",
                            message : "You are not authorized to perform this action"
                        };
                        return resp.redirect('/admin/login');
                    }
                }
            });
        }
        else {
            req.session.message = {
                type : "error",
                message : "Please Login to perform this action"
            };
            return resp.redirect('/admin/login');
            // return resp.render('./backend/default/login');
        }
}
module.exports = {isAdmin};
