const About = require("../../models/backend/About");
const User = require("../../models/backend/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
require('dotenv').config();
module.exports = {

    index: (req, resp) => {
        const currentUrl = req.originalUrl;
        resp.render('./backend/default/index',{title: 'Admin',currentUrl});
    },
    login:(req, resp,next) => {
        try {
            if(req.session.admin) {
                return resp.redirect('/admin');
            }
            const currentUrl = req.originalUrl;   
            return resp.render('./backend/default/login',{title: 'Login',currentUrl,layout:false});
        } catch (error) {
            req.session.message = {
                type: "error",
                message: error.message,
            };
            return resp.redirect("/");
        }
    },
    loginPost : async (req,resp,next)=>{
        try {
            const { email, password } = req.body;
            let user = await User.findOne({ email:email,role : 'admin' });
            if(!user){
                req.session.message = {
                    type: "error",
                    message: "Invalid Email",
                };
                return resp.redirect("/admin/login");
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                req.session.message = {
                    type: "error",
                    message: "Invalid Password",
                };
                return resp.redirect("/admin/login");
            }
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: "12h" },
                (err, token) => {
                    if (err) {
                        req.session.message = {
                            type: "error",
                            message: err.message,
                        };
                        return resp.redirect("/admin/login");
                    }
                    resp.cookie("adminToken", token, {
                        // httpOnly: true,
                        maxAge: 1000 * 60 * 60 * 24 * 7,
                    });
                    req.session.admin = user;
                    req.session.message = {
                        type: "success",
                        message: "Login Successful",
                    };
                    return resp.redirect("/admin");
                }

            )
        } catch (error) {
            req.session.message = {
                type: "error",
                message: error.message,
            };
            return resp.redirect("/admin/login");
        }
    },
    logout :(req,resp,next) => {
        try {
            if(req.session.admin){
                resp.clearCookie("adminToken");
                req.session.admin = null;
                req.session.message = {
                    type: "success",
                    message: "Logout Successful",
                };
                return resp.redirect("/admin/login");
            }else{
                req.session.message = {
                    type: "error",
                    message: "Please Login",
                };
                return resp.redirect("/admin/login");
            }
        } catch (error) {
            next(error);
        }
    },

    about: (req, resp) => {
        const currentUrl = req.originalUrl;
        About.findById('63cba2289ad8ac17d1576026', (err, about) => {
            if (err) {
                return resp.redirect("/admin");
            } else {
                if (about == null) {
                    return resp.redirect("/admin");
                } else {
                    return resp.render('./backend/default/about', { title: 'Update '+about.title, about: about ,currentUrl});
                }
            }
        });
    },

    // post req
    updateabout: (req, resp) => {
        About.findByIdAndUpdate('63cba2289ad8ac17d1576026', {
            title: req.body.title,
            description: req.body.description,
            updated_on:Date.now()
        }, (err, result) => {
            if (err) {
                resp.json({ message: err.message, type: 'danger' });
            } else {
                req.session.message = {
                    type: "success",
                    message: "About US Updated Successfully",
                };
                resp.redirect("/admin/about/update");
            }
        });
    },
}