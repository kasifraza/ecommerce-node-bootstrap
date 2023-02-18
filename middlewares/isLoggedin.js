const User = require('../models/backend/User');
const isLoggedIn = (req, res, next) => {
    if(req.session.user && req.session.user.role === 'user') {
        req.userData = req.session.user;
        return next();
    }else{
        req.session.message = {
            type : 'error',
            message : 'You are not logged in'
        };
        res.redirect('/user/login');
    }
}

module.exports = isLoggedIn;