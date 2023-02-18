const express = require('express');
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const productcontroller = require('../../../controllers/frontend/productcontroller');
const usercontroller = require('../../../controllers/frontend/usercontroller');
const apicontroller = require('../../../controllers/frontend/apicontroller');
const User = require('../../../models/backend/User');
const Product = require('../../../models/backend/Product');
const Cart = require('../../../models/backend/Cart');
const isUser = require('../../../middlewares/isUser');
const checkIsLoggedIn = require('../../../middlewares/isLoggedout');  // used for logout
const isLoggedIn = require('../../../middlewares/isLoggedin');
const notLoggedin = async(req,resp,next) => {
  const token = req.cookies.token;
  if(token){
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.user.id);
      if(user){
        req.session.user = user;
        if(req.cookies.cart){
          let cart = req.cookies.cart;
          if(cart.length > 0){
            for(let i = 0; i < cart.length; i++){
              const product = await Product.findOne({_id:cart[i].productId, status:true});
              if(product){
                const cartSave = new Cart({
                  user: user._id,
                  productId: product._id,
                  quantity: cart[i].quantity,
                  subTotal: product.price * cart[i].quantity
                });
                await cartSave.save();
                cart.splice(i,1);
                i--;
              } else {
                cart.splice(i,1);
                i--;
              }
            }
          } else {
            req.session.message = {
              type: 'warning',
              message : `Hey ${user.name}, you are already logged in.`
            };
            return resp.redirect('/');
          }
          resp.cookie('cart',cart);
          req.session.message = {
            type: 'warning',
            message : `Hey ${user.name}, you are already logged in.`
          };
          return resp.redirect('/');
        } else {
          return resp.redirect('/');
        }
      } else {
        return next();
      }
    } catch (error) {
      return next(error);
    }
  } else {
    return next();
  }
};

router.all('/*', (req, resp, next) => {
  req.app.set('layout', './layouts/layout')
  next();
});

// Login Page
router.route('/login')
  .get(notLoggedin,usercontroller.index)
  .post(apicontroller.login)


// Logout Action
router.route('/logout')
  .get(checkIsLoggedIn,usercontroller.logout)


// Signup Page
router.route('/register')
  .get(notLoggedin,usercontroller.signup)
  .post(apicontroller.register)


// User Activation Page
router.route('/activate/:id')
  .get(usercontroller.activate)


// Create User Address Post    //Get is in cart controller (hitting this post from checkout page)
router.route('/create-address')
  .post(isUser,usercontroller.createAddress)

router.route('/update-address/:id')
      .get(isUser,usercontroller.updateAddress)
  


//  My ACcount Page

router.route('/my-account')
      .get(isLoggedIn,usercontroller.myAccount)

router.route('/invoice/:id')
    .get(isLoggedIn,usercontroller.invoice)
      

module.exports = router;