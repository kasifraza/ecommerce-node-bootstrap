const Cart = require('../models/backend/Cart');
const retrieveCartCount = async (req, res, next) => {
	if (req.session.user) {
		const userId = req.session.user.id;
		const cartItems = await Cart.countDocuments({ user: userId });
		res.locals.cartCount = cartItems;
		if (req.cookies.cart) {
			res.locals.cartCount += req.cookies.cart.length;
		} else {
			res.locals.cartCount = cartItems;
		}
	} else if (req.cookies.cart) {
		res.locals.cartCount = req.cookies.cart.length;
	}
	else {
		res.locals.cartCount = 0;
	}
	next();
};
module.exports = retrieveCartCount;  