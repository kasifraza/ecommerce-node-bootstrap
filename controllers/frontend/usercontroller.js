const User = require("../../models/backend/User");
const Address = require('../../models/backend/Address')
const Order = require('../../models/backend/Order')
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
function generateOrderId() { 
    // 16 bytes = 128 bits 
    return crypto.randomBytes(16).toString("hex"); 
  } 
module.exports = {

    // Login page 
    index: (req, resp) => {
        resp.render('./frontend/user/login', { title: 'Login' })
    },

    // logout action
    logout : (req,resp) => {
        try {
            resp.clearCookie('token');
            req.session.destroy(error => {
                if(error){
                    throw new Error('Could Not LogOut');
                    // return resp.status(500).send({error : 'Could Not LogOut'});
                }
                message = {
                    type : 'success',
                    message : 'Successfully Logout'
                }
                return resp.redirect('/user/login');
                // return resp.status(200).send({message : 'Successfully Logout'});
            });
        } catch (error) {
            message = {
                type : 'error',
                message : error || 'Internal Server Error'
            }
            return resp.redirect('/');
        } 
    },

    // Signup page 
    signup: async (req, resp, next) => {
        resp.render('./frontend/user/register', { title: 'SignUp' })
    },
    // Activate User
    activate: async (req, resp, next) => {
        try {
            const userId = req.params.id;
            // update the user status
            User.updateOne({ _id: userId }, { $set: { status: true } }, (err) => {
                if (err) {
                    return resp.status(400).send();
                }
                req.session.message = {
                    type: "success",
                    message: 'User activated successfully',
                };
                resp.redirect("/user/login");
            });
        } catch (error) {
            req.session.message = {
                type: "error",
                message: error.message,
            };
            resp.redirect("/");
        }
    },

    // Create user address Post  => Get is in cart routes checkout page
    createAddress: async(req, resp) => {
        try {
            const checkoutid = generateOrderId();
            const { email, firstname, lastname, street, apartment, city, state, zip, phone, notes, } = req.body;
            const user = req.userData._id;
            // if(req.body.oldaddress){
            //     var oldaddress = req.body.oldaddress;
            //     const checkOldAddress = await Address.findById(oldaddress);
            //     if(!checkOldAddress){
            //         return resp.status(500).json({ status: false, message: error.message || 'Internal Server Error' });
            //     }else{
            //         const createAddress = new Address({
            //             user : user,
            //             email : checkOldAddress.email,
            //             firstname : checkOldAddress.firstname,
            //             lastname : checkOldAddress.lastname,
            //             street : checkOldAddress.street,
            //             apartment : checkOldAddress.apartment,
            //             city : checkOldAddress.city,
            //             state : checkOldAddress.state,
            //             zip : checkOldAddress.zip,
            //             phone : checkOldAddress.phone,
            //             notes : checkOldAddress.notes,
            //             type : checkOldAddress.type,
            //             checkoutid : checkoutid
            //         });
            //         createAddress.save((error, address) => {
            //             if (error) {
            //                 return resp.status(500).json({ status: false, message: error.message || 'Internal Server Error' });
            //             } else {
            //                 return resp.status(201).json({ status: true, address: address, message: 'Address Created Successfully' });
            //             }
            //         });
            //     }
            // }
            // else{
                var type ;
                if (req.body.type === 'on') {
                    const { s_email, s_firstname, s_lastname, s_street, s_apartment, s_city, s_state, s_zip, s_phone, s_notes, } = req.body;
                    type = 'shipping';
                    const createAddress = new Address({
                        user: user,
                        email: s_email,
                        firstname: s_firstname,
                        lastname: s_lastname,
                        street: s_street,
                        apartment: s_apartment,
                        city: s_city,
                        state: s_state,
                        zip: s_zip,
                        phone: s_phone,
                        notes: notes,
                        type: type,
                        checkoutid : checkoutid
                    });
                    createAddress.save();
                } 
                type = 'billing'
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
                    type: type,
                    checkoutid : checkoutid
                });
                createAddress.save((error, address) => {
                    if (error) {
                        return resp.status(500).json({ status: false, message: error.message || 'Internal Server Error' });
                    } else {
                        return resp.status(201).json({ status: true, address: address, message: 'Address Created Successfully' });
                    }
                });
            // }
            
        } catch (error) {
            errorstatus = error.status || 500;
            return resp.status(errorstatus).json({ status: false, message: error.message || 'Internal Server Error' });
        }
    },
    // Update User Address Render GET
    updateAddress :(req,resp,next) => {
        try{
            const addressId = req.params.id;
            Address.findById(addressId, (err, address) => {
                if(err){
                    req.session.message = {
                        type : 'error',
                        message : 'Address Not Found'
                    };
                    return resp.redirect('/user/my-account');
                }
                return resp.render('./frontend/user/update-address', { title: 'Update Address', address: address });
            });
        }catch(error){
            next(error);
        }
    },

    // See Invoice using invoice id
    invoice:(req,res,next) => {
        try {
            const invoiceId = req.params.id;
            Order.find({user : req.session.user._id,invoice : invoiceId}, (err, order) => {
                if(err){
                    req.session.message = {
                        type : 'error',
                        message : 'Invoice Not Found'
                    };
                    return res.redirect('/user/my-account');
                }
                const invoicePath = path.join(__dirname, `../../helpers/pdf/${invoiceId}`);
                fs.readFile(invoicePath, (err, data) => {
                    if (err) {
                        req.session.message = {
                            type : 'error',
                            message : 'Invoice Not Found'
                        };
                        return res.redirect('/user/my-account');
                    }
                    const invoiceStream = fs.createReadStream(invoicePath);
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `inline; filename=${invoiceId}`);
                    invoiceStream.pipe(res);   
                });
            });
        } catch (error) {
            next(error);
        }
    },
    myAccount:async(req,resp,next) => {
        try {            
            const userId = req.userData._id;
            const user = req.session.user;
            const addresses = await Address.find({ user: userId });
            const orders = await Order.find({ user: userId });
            return resp.render('./frontend/user/myAccount', { title: 'My Account', user: user,addresses:addresses,orders:orders });
        } catch (error) {
            next(error);
        }
    }
}