const jwt = require('jsonwebtoken');
const User = require('../../models/backend/User');
const isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized User !' });
            }
            User.findById(decoded.id, (err, user) => {
                if (err) {
                    return res.status(401).json({ message: 'Unauthorized User' });
                }
                if(user.role != 'user'){
                    return res.status(401).json({ message: 'You can not access' });
                }
                req.user = user;
                next();
            });
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized User Token Missing' });
    }
};
module.exports = isAuthenticated;

