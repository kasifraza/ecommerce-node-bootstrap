// helpers/product.js
const Product = require('../models/backend/Product');
const Cart = require('../models/backend/Cart');

// function to check and process cart cookie items
async function processCart(user, cart, resp) {
    // get all cart cookie items
    const cartItems = cart;
    // loop through cart items and check if they exist in product schema
    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        console.log(item);
        const product = await Product.findById(item.productId);
        // if (product) {
            // if product exists then push item to cart schema
            const subTotal = product.price * item.quantity;
            const cartSave = new Cart({
                user: user._id,
                productId: product._id,
                quantity: item.quantity,
                subTotal: subTotal
            });
            cartSave.save(false);
            // and delete from cart cookie
            cart.splice(item, 1);
            resp.cookie('cart', cartItems);
        // }
        // else {
        //     cart.splice(item, 1);
        //     resp.cookie('cart', cart);   
        // }
    }
}

module.exports = {
    processCart
}
