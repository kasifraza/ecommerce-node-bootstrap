const User = require('../models/backend/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const isLoggedIn = async (req, resp, next) => {
  const token = req.cookies.token;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (user) {
      req.session.user = user;
      req.data = 'user';
      return next();
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
    req.data = 'cookie';
    next();
  }
}
module.exports = isLoggedIn;