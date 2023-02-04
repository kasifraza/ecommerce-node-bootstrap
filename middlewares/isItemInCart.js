const User = require('../models/backend/User');
const jwt = require('jsonwebtoken');
const Cart = require('../models/backend/Cart');
const Product = require('../models/backend/Product');
require('dotenv').config();
const isItemsInCart = async (req, resp, next) => {
    const token = req.cookies.token;
      if (!token) {
        req.session.message = {
          type: 'warning',
          message: 'Please Login First'
        };
        return resp.redirect('/user/login');
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);
        if (!user) {
          req.session.message = {
            type: 'warning',
            message: 'Please Login First'
          };
          return resp.redirect('/user/login');
        }
        req.session.user = user;
        let cart = req.cookies.cart;
        if(req.cookies.cart){
          for (let i = 0; i < cart.length; i++) {
            const product = await Product.findOne({
              _id: cart[i].productId,
              status: true
            });
            if (!product) {
              cart.splice(i, 1);
              i--;
              continue;
            }
            const cartSave = new Cart({
              user: user._id,
              productId: product._id,
              quantity: cart[i].quantity,
              subTotal: product.price * cart[i].quantity
            });
            await cartSave.save();
            cart.splice(i, 1);
            i--;
          }
          resp.cookie('cart', cart);
        }
        return next();
      } catch (error) {
        req.session.message = {
          type: 'error',
          message: 'Please Login First'
        };
        // // return next(error);
        return resp.redirect('/');
       
      }
  }

  module.exports = isItemsInCart;