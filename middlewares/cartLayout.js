const User = require('../models/backend/User');
const jwt = require('jsonwebtoken');
const Cart = require('../models/backend/Cart');
const Product = require('../models/backend/Product');
require('dotenv').config();
// this is using when user opens the cart page
// i am checking here that in user browser cookie my jwt token is stored or not
// if stored then user logged user scenario
// if jwt is not found then cart cookie scenario will work
// 
// if user have token in his cookie then i am validating that token and check that which user is it
// if that token is valid then i will check that in user browser cookie cart cookie is available or not if 
// if cart cookie is available then i will iterarte all items in cart using foreach loop and then checks that the product id is available in cart cookie is a real product id or not will my product table
// if that is a real product then i am checking that is this product is in stock if that is a product and in stock then 
// i am checking that the same product id and same user id is available or not in cart database  
// if that product id and that user id is available then i will only update that row quantity
// or if this this product id is not find in cart with relation with this user id then i will add this product id from cart cookie and quantity from cart cookie to cart database 
// and after this process i will remove that product id from cart cookie 
// i will do this simulteniously on every iteration of foreach loop

const isCart = async (req, resp, next) => {
    const token = req.cookies.token;

    if (!token) {
        if (req.cookies.cart) {
            req.data = 'cookie';
            return next();
        } else {
            req.session.message = {
                type: 'warning',
                message: 'Please Login and Enjoy Shopping'
            };
            return resp.redirect('/user/login');
        }
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.user.id);
        if (!user) {

            req.session.message = {
                type: 'warning',
                message: 'Please Login and Enjoy Shopping'
            };
            return resp.redirect('/user/login');

        }

        req.session.user = user;
        const cart = req.cookies.cart;
        
        if(!cart){
            req.data = user;
            return next();
        }

        if(cart.length > 0){
            for(i=0;i<cart.length;i++){

                const product = await Product.findById(cart[i].productId);
                if (!product || !product.stock) {
                    cart.splice(i, 1);
                    i--;
                    continue;
                }

                const alreadyCartItem = await Cart.findOne({ user: user._id, productId: product._id });
                if (alreadyCartItem) {
                    const newQuantity = alreadyCartItem.quantity + Math.max(cart[i].quantity, 1);
                    await Cart.updateOne({ user: user._id, productId: product._id }, { $set: { quantity: newQuantity } });
                    cart.splice(i,1);
                    i--;
                }
                else {
                    const cartSave = new Cart({
                        user: user._id,
                        productId: product._id,
                        quantity: Math.max(cart[i].quantity, 1),
                        subTotal: Math.max(cart[i].quantity, 1) * product.price,
                    });
                    await cartSave.save();
                    cart.splice(i,1);
                    i--;
                }
                
            }
            resp.cookie('cart',cart);
        }
        req.data = user;
        return next();
    } catch (error) {
        req.session.message = {
            type: 'error',
            message: error.message || 'Internal Server Error'
        };
        return resp.redirect('/shop');
    }
};
module.exports = isCart;