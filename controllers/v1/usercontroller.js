const User = require('../../models/backend/User');
const Address = require('../../models/backend/Address');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();
module.exports = {
    index:(req,res) => {
        res.send(200);
    },


    login:async(req,res) => {
        try {
            const {email , password} = req.body;
            const user = await User.findOne({email:email});
            if(!user){
                return res.status(500).json({message : 'Invalid Email'});
            }
            const isMatch = bcrypt.compareSync(password,user.password);
            if(!isMatch){
                return res.status(500).json({message : 'Invalid Password'});
            }
            jwt.sign({id:user._id},process.env.JWT_SECRET,(err, token) => {
                if(err){
                    return res.status(500).json({message : 'Error occurred while creating token'});
                }
                const persistedUser = {
                    name : user.name,
                    email : user.email,
                    lastLoginTime : Date.now(),
                }
                return res.status(200).json({token,message : 'Logged-In successfully',persistedUser});
            });
        }catch(e){
            return res.status(500).json({message : 'Internal Server Error'});
        }
    },

    register :async(req,res) => {
        try{
            const {email, password,name,confirm_password } = req.body;
            const alreadyuser = await User.findOne({email:email});
            if(alreadyuser){
                return res.status(500).json({message : 'User already exists'});
            }
            const user = new User({
                email,
                password,
                name,
                role : 'user',
                status : true
            });
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(confirm_password,salt);
            user.password = hash;
            user.save((err,user) => {
                if(err){
                    return res.status(500).json({message : 'Internal Server Error'});
                }
                return res.status(201).json({message : 'User Registered successfully',user: {
                    _id : user._id,
                    name : user.name,
                    email : user.email,
                    role : user.role,
                }});
            });
        }catch(error){
            return res.status(500).json({message : 'Internal Server Error'});
        }
    },

    changePassword : async(req,res) => {
        try{
            const {oldpassword,password,confirm_password } = req.body;
            const compare = await bcrypt.compare(oldpassword,req.user.password);
            if(!compare){
                return res.status(500).json({message : 'Invalid Old Password'});
            }
            if(password!== confirm_password){
                return res.status(500).json({message : 'Passwords do not match'});
            }
            if(password.length < 6){
                return res.status(500).json({message : 'Password must be at least 6 characters long'});
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password,salt);
            req.user.password = hash;
            req.user.save((err,user) => {
                if(err){
                    return res.status(500).json({message : 'Internal Server Error'});
                }
                return res.status(200).json({message : 'Password Changed successfully',user : {
                    _id : user._id,
                    name : user.name,
                    email : user.email,
                    role : user.role,
                    status : user.status
                }});
            });
        }catch(error){
            return res.status(500).json({message : 'Internal Server Error'});
        }
    },

    updateUser: async(req, res) => {
        try {
            const { name, email } = req.body;
            const existUser = await User.findOne({ _id: { $ne: req.user._id },email  : email });
            if (existUser) {
                return res.status(500).json({ message: 'User already exists' });
            }
            req.user.name = name;
            req.user.email = email;
            req.user.save((err, user) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                return res.status(200).json({ message: 'User Updated successfully', 
                user:{
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    role : user.role,
                    status : user.status
                } });
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createAddress: async (req, res) => {
        try {
            const { firstname,lastname,street,apartment,  city, state, zip , phone , email , notes} = req.body;
            const userAddress = new Address({
                user: req.user._id,
                type:'shipping',
                firstname,
                lastname,
                street,
                apartment,
                city,
                state,
                zip,
                phone,
                email,
                notes
            });
            userAddress.save((err, userAddress) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                return res.status(201).json({
                    message: 'Address Created successfully',
                    userAddress: userAddress,
                    user: {
                        id: req.user._id,
                        name: req.user.name,
                        email: req.user.email,
                        role: req.user.role,
                        status: req.user.status
                    }
                });
            });

        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    updateAddress: async (req, res) => {
        try {
            const { firstname, lastname, street, apartment, city, state, zip, phone, email, notes } = req.body;
            req.address.firstname = firstname;
            req.address.lastname = lastname;
            req.address.street = street;
            req.address.apartment = apartment;
            req.address.city = city;
            req.address.state = state;
            req.address.zip = zip;
            req.address.phone = phone;
            req.address.email = email;
            req.address.notes = notes;
            req.address.save((err, address) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                return res.status(200).json({ 
                    message: 'Address Updated successfully',
                    address,
                    user: {
                        id: req.user._id,
                        name: req.user.name,
                        email: req.user.email,
                        role: req.user.role,
                        status: req.user.status
                    }
                });
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    viewAddress: async (req, res) => {
        try{
            if(!req.address){
                return res.status(500).json({message : 'Address not found'});
            }
            return res.status(200).json({
                address : req.address,
                user: {
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role,
                    status: req.user.status
                }
            });
        }catch(error){
            return res.status(500).json({message : 'Internal Server Error'});
        }
    },

    allAddress: async (req, res) => {
        try {
            const addresses = await Address.find({ user: req.user._id });
            if (!addresses) {
                return res.status(500).json({ message: 'Address not found' });
            }
            if (addresses.length === 0) {
                return res.status(500).json({ message: '0 address found' });
            }
            return res.status(200).json({
                addresses,
                user: {
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role,
                    status: req.user.status
                }
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}