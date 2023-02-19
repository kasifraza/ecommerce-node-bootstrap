const Product = require('../../models/backend/Product');
const Cart = require('../../models/backend/Cart');
module.exports = {
    addToCartSingleQuantity: async (req, res) => {
        try {
          const { user, product, cart } = req;            
          if (!user || !product) {
            return res.status(422).json({ message: 'User ID and Product ID are required.' });
          }
      
          if (cart) {
            cart.quantity += 1;
            cart.subTotal = cart.quantity * product.price;
          } else {
            req.cart = new Cart({
              user: user._id,
              productId: product._id,
              quantity: 1,
              subTotal: product.price
            });
          }
      
          const savedCart = await req.cart.save();
      
          if (!savedCart) {
            return res.status(500).json({ message: 'An error occurred while adding to cart.' });
          }
      
          return res.status(200).json({
            cart: savedCart,
            message: 'Product added to cart successfully',
            user: {
              _id: user._id,
              name: user.name,
              email: user.email
            }
          });
        } catch (err) {
          return res.status(500).json({ message: 'An error occurred while adding to cart.' });
        }
    },

    addToCartWithQuantity: async (req, res) => {
        try {
            const { user, product, cart } = req;
            const { quantity, productId } = req.body;
            if (!user || !product) {
                return res.status(422).json({ message: 'User  and Product are required.' });
            }
            if (cart) {
                cart.quantity += parseInt(quantity);
                cart.subTotal = cart.quantity * product.price;
            }
            else {
                req.cart = new Cart({
                    user: user._id,
                    productId: product._id,
                    quantity: parseInt(quantity),
                    subTotal: product.price * quantity
                });
            }
            const savedCart = await req.cart.save();
            if (!savedCart) {
                return res.status(500).json({ message: 'An error occurred while adding to cart.' });
            }
            return res.status(200).json({
                cart: savedCart,
                message: 'Product added to cart successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (err) {
            return res.status(500).json({ message: 'An error occurred while adding to cart.' });
        }
    },

  getCart: async (req, res) => {
    try {
      const { user } = req;
      Cart.find({ user: user._id }).populate('productId').exec((err, carts) => {
        if (err) {
          return res.status(500).json({ message: 'An error occurred while fetching cart.' });
        }
        if (carts.length === 0) {
          return res.status(404).json({ message: 'Cart is Empty.' });
        }
        return res.status(200).json({
          cart: carts,
          message: 'Cart Items fetched successfully',
          user: {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        });
      });
    } catch (err) {
      return res.status(500).json({ message: 'An error occurred while getting cart.' });
    }
  }
      
}