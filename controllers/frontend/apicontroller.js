const Product = require('../../models/backend/Product');
const User = require('../../models/backend/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const cartHelper = require('../../helpers/cart');
const Cart = require('../../models/backend/Cart');
const Cache = require('../../models/backend/Cache');
const Address = require('../../models/backend/Address');
const moment = require('moment');
const _ = require('lodash');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
    },
});
const renderTemplate = (data) => {
    try {

        return new Promise((resolve, reject) => {
            ejs.renderFile(
                __dirname + "/mailer/activation.ejs",
                data,
                (err, str) => {
                    if (err) {
                        throw new Error(err);
                        // reject(err);
                    } else {
                        resolve(str);
                    }
                }
            );
        });
    } catch (error) {
        console.log(error);
        reject(error)
    }
};
module.exports = {
    // Shop Page GET API
    shop: (req, resp) => {
        let query = Product.find();
        if (req.query.sort) {
            query = query.sort(req.query.sort);
        }
        if (req.query.filter) {
            query = query.where(req.query.filter);
        }
        query.exec(async (err, products) => {
            if (err) {
                return resp.status(500).json({ error: 'Error while finding products' });
            }
            return resp.json({ products: products, title: 'Shop' });
        })
    },
    register: async (req, resp, next) => {
        const { name, email, password, confirm_password } = req.body;
        const role = 'user';
        try {
            let user = await User.findOne({ email });

            if (user) {
                return resp.status(400).json({ status: false, message: "User already exists" });
            }

            // Validate Name
            else if (!name || name.length < 5) {
                return resp.status(400).json({ status: false, message: "Name is required and must be at least 3 characters" });
            }

            // Validate Email
            else if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                return resp.status(400).json({ status: false, message: "Invalid Email" });
            }

            // Validate Password
            else if (!password || password.length < 6) {
                return resp.status(400).json({ status: false, message: "Password is required and must be at least 6 characters" });
            }

            else if (!confirm_password || confirm_password != password) {
                return resp.status(400).json({ status: false, message: "Confirm Password should be equal to password" });
            }

            user = new User({
                name,
                email,
                password,
                role
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(confirm_password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };
            const activationLink = `${process.env.URL}user/activate/${user._id}`;
            console.log(activationLink);
            const html = await renderTemplate({ activationLink });
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 360000 },
                async (err, token) => {
                    if (err) throw err;
                    transporter.sendMail({
                        from: process.env.MAIL_EMAIL,
                        to: email,
                        subject: "Activate your account",
                        html,
                    });
                    resp.status(201).json({ status: true, message: 'User Registered Successfully', token });
                }
            );
        } catch (err) {
            console.error(err);
            resp.status(500).json({ status: false, message: "Internal Server Error" });
        }

    },
    login: async (req, resp) => {
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return resp.status(400).json({ status: false, message: "Invalid Email" });
            }
            if(user.role!= 'user'){
                return resp.status(400).json({ status: false, message: "You are not authorized to access this page" });
            }
            if (user.status != true) {
                return resp.status(403).json({ status: false, message: "Activate Your Account First Through link sent on Email" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return resp.status(400).json({ status: false, message: "Invalid Password" });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };
            const cart = req.cookies.cart || [];
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 3600000 },
                async (err, token) => {
                    if (err) throw err;
                    resp.cookie('token', token, {
                        maxAge: 30 * 86400000 
                    });
                    for (let i = 0; i < cart.length; i++) {
                        const product = await Product.findById(cart[i].productId);
                        if (product && product.stock) {
                            const subTotal = product.price * cart[i].quantity;
                            const cartSave = new Cart({ user: user._id, productId: product._id, quantity: cart[i].quantity, subTotal: subTotal });
                            cartSave.save();
                            cart.splice(cart[i], 1);
                        }
                        else {
                            cart.splice(i, 1);
                            throw new Error('Product is Out of Stock')
                        }
                        resp.cookie('cart', cart);
                    }
                    req.session.user = user;
                    req.userData = user;
                    resp.json({ status: true, message: 'Logged In Successfully', token });
                }
            );
        } catch (err) {
            resp.status(500).send("Internal Server Error");
        }
    },

    // Update User Profile PUT Method
    updateProfile : async(req,resp,next)=>{
        try{
            const user = req.userData;
            const {email,name} =req.body;
            const updateUser = await User.findByIdAndUpdate(user._id,{email,name});
            if(!updateUser){
                return resp.status(404).json({status:false,message:'User not found'});
            }
            return resp.status(200).json({status:true,message:'Profile Updated Successfully'});
        }catch(err){
            return resp.status(500).json({status:false,message:'Internal Server Error'});
        }
    },

    // Create user Address
    userAddress: async (req, resp) => {
        try {
            const { email, firstname, lastname, street, apartment, city, state, zip, phone, notes, } = req.body;
            const user = req.userData._id;
            var type = 'shipping';
            if (req.body.type) {
                type = 'billing';
            }
            const createAddress = new Address({
                user: user,
                email: email,
                firstname: firstname,
                lastname: lastname,
                street: street,
                apartment: apartment,
                city: city,
                state: state,
                zip: zip,
                phone: phone,
                notes: notes,
                type: type
            });
            createAddress.save((error, address) => {
                if (error) {
                    return resp.status(500).json({ status: false, message: error.message || 'Internal Server Error' });
                } else {
                    return resp.status(201).json({ status: true, address: address, message: 'Address Created Successfully' });
                }
            });
        } catch (error) {
            errorstatus = error.status || 500;
            return resp.status(errorstatus).json({ status: false, message: error.message || 'Internal Server Error' });
        }
    },
    // Update user Address PUT Method



    // update user a particular address
    updateUserAddress: async (req, resp) => {
        try {
            if (!req.params.id) {
                return resp.status(400).json({ status: false, message: 'Missing Address ID' });
            }
            const user = req.userData._id;
            const addressId = req.params.id;
            const { email, firstname, lastname, street, apartment, city, state, zip, phone, notes, } = req.body;
            if (!email || email == '') {
                return resp.status(204).json({ status: false, message: 'Email is Required' });
            } else if (!firstname || firstname == '') {
                return resp.status(204).json({ status: false, message: 'First Name is Required' });
            } else if (!lastname || lastname == '') {
                return resp.status(204).json({ status: false, message: 'Last Name is Required' });
            } else if (!street || street == '') {
                return resp.status(204).json({ status: false, message: 'Street is Required' });
            } else if (!city || city == '') {
                return resp.status(204).json({ status: false, message: 'City is Required' });
            } else if (!state || state == '') {
                return resp.status(204).json({ status: false, message: 'State is Required' });
            } else if (!zip || zip == '') {
                return resp.status(204).json({ status: false, message: 'Zip Code is Required' });
            } else if (!phone || phone == '') {
                return resp.status(204).json({ status: false, message: 'Phone Number is Required' });
            }
            const update = await Address.findOneAndUpdate(
                { user: user, _id: addressId },
                { email, firstname, lastname, street, apartment, city, state, zip, phone, notes, },
                { new: true }
            );
            if (!update) {
                return resp.status(500).json({ status: false, message: 'Error occured while updating address' });
            } else {
               return resp.status(200).json({ status: true, message: 'Address Updated Successfully' });
            }

        } catch (error) {
            errorstatus = error.status || 500;
            return resp.status(errorstatus).json({ status: false, message: error.message || 'Internal Server Error' });
        }
    },
    test:async (req,resp)=>{
        // let cachedProductData = [];
        // let cachedTimestamp = null;
        // const refreshProductData = async () => {
        //     cachedProductData = await Product.find({});
        //     cachedTimestamp = moment();          
        //     await Cache.deleteMany({});
        //     await Cache.create({
        //       data: cachedProductData,
        //       timestamp: cachedTimestamp.toDate()
        //     });
        // }
        // const getCachedProductData = async () => {
        //     if (!cachedProductData || !cachedTimestamp) {
        //       const cache = await Cache.findOne({});
        //       if (cache) {
        //         cachedProductData = cache.data;
        //         cachedTimestamp = moment(cache.timestamp);
        //       }
        //     }
          
        //     const now = moment();
        //     const timeDifference = moment.duration(now.diff(cachedTimestamp)).asHours();
        //     if (!cachedProductData || timeDifference >= 24) {
        //       refreshProductData();
        //     }
        //     return cachedProductData;
        //   }
        //   setInterval(() => {
        //     getCachedProductData();
        //   }, 24 * 60 * 60 * 1000); // Runs once a day
    }

}