const User = require('../models/backend/User');
const jwt = require('jsonwebtoken');
const Cart = require('../models/backend/Cart');
const Product = require('../models/backend/Product');
require('dotenv').config();

const isInc = async (req, resp, next) => {
  const token = req.cookies.token;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (user) {
      req.session.user = user;
      req.data = user;
      next();
    }
    else {
      req.session.message = {
        type: 'warning',
        message: `Please Login and Enjoy Shopping`
      };
      resp.redirect('/user/login');
    }
  }
  else if (req.cookies.cart && !token) {
    req.data = 'cookie';
    next();    
}else{
    req.session.message = {
        type: 'error',
        message : 'Internal Server Error'
    };
    return resp.redirect('/cart')
}
  
}
module.exports = isInc;