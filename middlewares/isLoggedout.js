const checkIsLoggedIn = (req,resp,next) => {
    if(!req.session.user) {
        req.session.message = {
            type : 'warning',
            message : 'Unauthorized User'
        };
        return resp.redirect('/');
    }
    next();
};

module.exports = checkIsLoggedIn;