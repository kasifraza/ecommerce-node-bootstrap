const express = require('express');
const router = express.Router();
const productcontroller = require('../../../controllers/frontend/productcontroller');
const cartcontroller = require('../../../controllers/frontend/cartcontroller');
const authenticate = require('../../../middlewares/checkuser')
const isItemsInCart = require('../../../middlewares/isItemInCart');
const isCart = require('../../../middlewares/cartLayout');
const isInc = require('../../../middlewares/incdec');
const emptycart = require('../../../middlewares/emptycart');
router.all('/*',(req,resp,next) => {
    req.app.set('layout', './layouts/layout')
    next();
});

// Cart Page
router.route('/')
    .get(isCart,cartcontroller.index);

// WishList Page
router.route('/wishList')
    .get(cartcontroller.wishList);

// Add to Cart Action post
router.route('/add-to-cart')
    .post(cartcontroller.addTOCart);

// Add to Wishlist Action post
router.route('/add-to-wishlist')
    .post(cartcontroller.addToWishList);

// Update Cart quantity Action post INCREMENT
router.route('/increment')
    .post(isInc,cartcontroller.increment);

// Update Cart quantity Action post DECREMENT
router.route('/decrement')
    .post(isInc,cartcontroller.decrement);

// Remove item from cart using id
router.route('/remove-item/:id')
    .delete(emptycart,cartcontroller.removeItem);

// Remove Cart Cookie
router.route('/empty-cart')
    .post(emptycart ,cartcontroller.emptyCart);

// Add to Cart from post method by Product detail 
router.route('/add-to-cart-detail')
    .post(cartcontroller.addToCartDetail);


// Checkout Page Render
router.route('/checkout')
    .get(isItemsInCart,cartcontroller.checkout)
    .post(isItemsInCart,cartcontroller.checkoutPost);


// Payment success
router.route('/success')
    .get(cartcontroller.success)

// Payment Cancel
router.route('/cancel')
    .get(cartcontroller.cancel)





module.exports = router;