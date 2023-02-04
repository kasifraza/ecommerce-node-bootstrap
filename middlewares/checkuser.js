const User = require('../models/backend/User');
const jwt = require('jsonwebtoken');
const Cart = require('../models/backend/Cart');
const Product = require('../models/backend/Product');
require('dotenv').config();
module.exports = {
  isUser: (req, resp, next) => {
    if (req.session.user) {
      return resp.redirect('/');
    }
    next();
  }
}
const authenticate = async (req, resp, next) => {
  // const token = req.headers.authorization.split(" ")[1];  
  try {
    const token = req.cookies.token;
    if (!token) {
      resp.redirect('/user/login');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET,);
    const user = await User.findById(decoded.user.id);
    if (!user) {
      resp.redirect('/user/login');
    }
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };
    next();
  } catch (err) {
    resp.status(401).json({ status: false, message: err.message });
  }
};

const isLogged = async (req, resp, next) => {
  const token = req.cookies.token;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if(user.role != 'user'){
      req.session.message = {
        type: 'warning',
        message: `You do not have permission to access this page`
      };
      return resp.redirect('/');
    }
    if (user) {
      req.session.message = {
        type: 'success',
        message: `Welcome ${user.name}`
      };
      req.session.user = user;
      if (req.cookies.cart) {
        const cart = req.cookies.cart;
        if (cart.length > 0) {
          cart.forEach(async (item, index) => {
            const product = Product.findById(item.productId);
            if (product && product.stock) {
              const cartSave = new Cart({
                user: user._id,
                productId: product._id,
                quantity: item.quantity,
                subTotal: item.quantity * product.price,
              });
              await cartSave.save();
              cart.splice(index, 1);
              resp.cookie('cart');
            }
            else {
              cart.splice(index, 1);
              resp.cookie('cart');
            }
          });
          next();
        }
        else {
          req.session.message = {
            type: 'warning',
            message: `Please Add Some item to Cart`
          };
          resp.redirect('/shop');
        }
      } else {
        next();
      }
    }
    else {
      req.session.message = {
        type: 'warning',
        message: `Please Login First`
      };
      resp.redirect('/user/login');
    }
  }
  else {
    req.session.message = {
      type: 'warning',
      message: `Please Login First`
    };
    resp.redirect('/user/login');
  }
}
module.exports = authenticate, isLogged;