const Product = require('../../models/backend/Product');
const Category = require('../../models/backend/Category');
const prstatus = require('../../helpers/product');
const Cart = require('../../models/backend/Cart');
const isLogged = require('../../middlewares/checkuser');
const Address = require('../../models/backend/Address');
const paypal = require('paypal-rest-sdk');
const Transactions = require('../../models/backend/Transactions');
const Order = require('../../models/backend/Order');
const sendMail = require('../../helpers/orderConfirmMail');
require('dotenv').config();
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AYt6vVzqvNwrQouDZsO63Khp1Q8-gWoFPK4q5PTKNCWgq1q_SCalsoAVIEuj6PTXm-4ydvTPG30I4R7u',
  'client_secret': 'EEH4QwxjYYkYQ9HJHmTGUJ7Dg4TQv-W7lrfMQDa192lRo1CaDQHnn5glcK85hGRlHHPbQUKrsMQ8xtWP'
});
module.exports = {

  // Shop page
  index: async (req, resp, next) => {
    // console.log(req.data)
    // Get the cart cookie
    // var cart = null;
    const cart = req.cookies.cart;
    // Initialize an empty array to store the product details
    let productDetails = [];

    // If the cart cookie is not empty
    if (cart && cart.length > 0 && req.data === 'cookie') {
      for (let i = 0; i < cart.length; i++) { // Check if the product ID matches a product in the database
        const product = await Product.findOne({ _id: cart[i].productId });
        if (product) { // If a match is found, add the product details to the array
          productDetails.push([
            product, cart[i].quantity
          ]);
        } else { // If no match is found, remove the product ID from the cart cookie
          cart.splice(i, 1);
          // Update the cart cookie
          resp.cookie('cart', cart);
        }
      }
    } else if (req.data) {
      const id = req.data.id;
      const products = await Cart.find({ user: id }).populate('productId');
      if (products) {
        products.forEach(product => {
          productDetails.push([product.productId, product.quantity]);
        });
      }
    } else {
      req.session.message = {
        type: 'error',
        message: 'Please Add some item to cart'
      };
      return resp.redirect('/shop');
    }
    return resp.render('./frontend/cart/cart', {
      title: 'Cart',
      productDetails
    });
  },



  addTOCart: async (req, resp, next) => {
    try {
      let { productId, quantity } = req.body;
      let cart = req.cookies.cart || [];
      if (!productId || !quantity) {
        throw new Error('product id and quantity are required');
      }
      const product = await prstatus.checkProduct(productId);
      if (product.error) {

        throw new Error(product.error);
      }
      let existingProduct = cart.find(product => product.productId == productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.push({ productId, quantity });
      }
      // Set the updated cart data in a cookie
      resp.cookie('cart', cart, {
        maxAge: 60 * 60 * 24 * 365
      });
      // Send the updated cart data to the client
      return resp.json({ status: true, message: 'Product Added !' });
    } catch (error) {
      return resp.json({ status: false, message: error.message });
    }

  },


  wishList: async (req, resp, next) => { // Get the wishlist cookie
    const wishlist = req.cookies.wishlist;
    // Initialize an empty array to store the product details
    let productDetails = [];

    // If the wishlist cookie is not empty
    if (wishlist) {
      for (let i = 0; i < wishlist.length; i++) { // Check if the product ID matches a product in the database
        const product = await Product.findOne({ _id: wishlist[i].productId });
        if (product) { // If a match is found, add the product details to the array
          productDetails.push([product]);
        } else { // If no match is found, remove the product ID from the wishlist cookie
          wishlist.splice(i, 1);
          // Update the wishlist cookie
          resp.cookie('wishlist', wishlist);
        }
      }
      resp.render('./frontend/cart/wishList', {
        title: 'WishList',
        productDetails
      });
    }
  },



  addToWishList: async (req, resp) => {
    try {

      let { productId } = req.body;
      if (!productId) {
        throw new Error('Something went wrong');
      }
      let wishlist = req.cookies.wishlist || [];

      let existingProduct = wishlist.find(product => product.productId == productId);
      if (existingProduct) {
        throw new Error('Product already added to wishlist')
      } else {
        wishlist.push({ productId });
      }

      // Set the updated cart data in a cookie
      resp.cookie('wishlist', wishlist, {
        maxAge: 60 * 60 * 24 * 365
      });
      // Send the updated cart data to the client
      return resp.json({ status: true, message: 'Product Added to wishlish !' });
    } catch (error) {
      return resp.json({ status: false, message: error.message });
    }
  }, 



  addToCartDetail: async (req, resp) => {
    try {
      const { productId, quantity } = req.body;

      if (typeof productId === 'undefined' || typeof quantity === 'undefined') {
        return resp.status(400).json({ status: false, message: 'Product Id and Quantity is Required' });
      }
      let cart = req.cookies.cart || [];
      const product = await Product.findOne({ _id: productId });
      if (!product) {
        return resp.status(400).json({ status: false, message: 'Product Not Found' });
      }
      let existingProduct = cart.find(product => product.productId == productId);
      if (existingProduct) {
        const oldqty = existingProduct.quantity;
        const newqty = parseInt(oldqty) + parseInt(quantity);
        if (newqty >= 10) {
          return resp.status(400).json({ status: false, message: 'You have already added 10 Products  in cart' });
        }
        existingProduct.quantity = newqty;
      } else {
        const qty = parseInt(quantity);
        if (qty >= 10) {
          return resp.status(400).json({ status: false, message: 'You have already added 10 Products  in cart' });
        }
        cart.push({ productId, qty });
      }
      // Set the updated cart data in a cookie
      resp.cookie('cart', cart, {
        maxAge: 60 * 60 * 24 * 365
      });
      return resp.status(200).json({ status: true, message: 'Product Added to cart' });
    } catch (error) {
      return resp.status(500).json({ status: false, message: error.message });
    }

  },


  // increment
  increment: async (req, resp) => {
    try {
      const productId = req.body.productId;
      if (req.data === 'cookie') {
        let cart = req.cookies.cart;
        if (!cart || cart.length < 1) {
          throw new Error('Cart is Empty');
        }
        let index = cart.findIndex(product => product.productId === productId);
        if (index !== -1) {
          if (cart[index].quantity < 10) {
            cart[index].quantity += 1;
          } else {
            throw new Error('Maximum 10 Products is Allowed')
          }
        } else {
          throw new Error('Product is not exist in cart');
        }
        resp.cookie('cart', cart);
        const productDetails = await prstatus.getProductDetails(cart);
        req.app.set('layout', './layouts/ajax');
        resp.render('./frontend/cart/cart_ajax', { productDetails, title: 'Cart' });
      } else if (req.data) {
        const productDetails = [];
        const updatecart = await Cart.findOne({ productId: productId, user: req.data._id });
        if (!updatecart) {
          throw new Error('Something went wrong');
        }
        var newqty = updatecart.quantity + 1;
        if (updatecart.quantity >= 10) {
          var newqty = 10;
        }
        const updatingcart = await Cart.updateOne({
          user: req.data._id,
          productId: productId
        }, {
          $set: {
            quantity: newqty
          }
        });
        if (!updatingcart) {
          throw new Error('Error occured while updating increasing quantity');
        }
        const productsdata = await Cart.find({ user: req.data._id }).populate('productId');

        if (productsdata) {
          productsdata.forEach(product => {
            productDetails.push([product.productId, product.quantity]);
          });
        }
        req.app.set('layout', './layouts/ajax');
        return resp.render('./frontend/cart/cart_ajax', { productDetails, title: 'Cart' });
      }

    } catch (error) {
      return error;
    }
  },


  // decrement
  decrement: async (req, resp) => {
    try {
      const productId = req.body.productId;
      if (req.data === 'cookie') {
        let cart = req.cookies.cart;
        if (!cart) {
          throw new Error('Cart is Empty');
        }
        let index = cart.findIndex(product => product.productId === productId);
        if (index !== -1) {
          if (cart[index].quantity <= 1) {
            throw new Error('Minimum 1 Product is Required');
          }
          cart[index].quantity -= 1;
        } else {
          throw new Error('Product is not exist in cart');
        }
        resp.cookie('cart', cart);
        const productDetails = await prstatus.getProductDetails(cart);
        req.app.set('layout', './layouts/ajax');
        resp.render('./frontend/cart/cart_ajax', { productDetails, title: 'Cart' });
      } else if (req.data) {
        const productDetails = [];
        const updatecart = await Cart.findOne({ productId: productId, user: req.data._id });
        if (!updatecart) {
          throw new Error('Something went wrong');
        }
        var newqty = updatecart.quantity - 1;
        if (updatecart.quantity <= 1) {
          var newqty = 1;
        }
        const updatingcart = await Cart.updateOne({ user: req.data._id, productId: productId }, { $set: { quantity: newqty } });
        if (!updatingcart) {
          throw new Error('Error occured while updating increasing quantity');
        }
        const productsdata = await Cart.find({ user: req.data._id }).populate('productId');
        if (productsdata) {
          productsdata.forEach(product => {
            productDetails.push([product.productId, product.quantity]);
          });
        }
        req.app.set('layout', './layouts/ajax');
        return resp.render('./frontend/cart/cart_ajax', { productDetails, title: 'Cart' });
      }
    } catch (error) {
      return error;
    }
  },


  // remove a particular item from cart cookie
  removeItem: async (req, resp) => {
    try {
      if (req.data === 'cookie') {
        let cart = req.cookies.cart;
        if (!cart) {
          throw new Error('Cart is Empty');
        }
        let index = cart.findIndex(product => product.productId === req.params.id);
        if (index === -1) {
          throw new Error('Product is not exist in cart');
        }
        cart.splice(index, 1);
        resp.cookie('cart', cart);
        return resp.status(200).send({ message: 'Product removed from cart.' });
      } else if (req.data === 'user' && req.session.user) {
        const checkInCart = await Cart.findOneAndDelete({ user: req.session.user._id, productId: req.params.id });
        if (checkInCart) {
          return resp.status(200).send({ message: 'Product removed from Cart.' });
        } else {
          throw new Error('Error occured while removing item from cart');
        }
      } else {
        throw new Error('Something went wrong ');
      }
    } catch (error) {
      return resp.status(500).send(error.message);
    }
  },




  // remove all items from cart cookie
  emptyCart: (req, resp) => {
    try {
      if (req.session.user && req.data === 'user') {
        const usercart = Cart.deleteMany({
          user: req.session.user._id
        }, (error) => {
          if (error) {
            throw new Error('Error occured while deleting items from cart');
          } else {
            return resp.json({ status: true, message: 'Now Cart is Empty' });
          }
        });
      } else if (req.data === 'cookie') {
        resp.clearCookie('cart');
        return resp.json({ status: true, message: 'Now Cart is Empty' });
      } else {
        return resp.json({ status: false, message: 'Some issue with server please login to avoid intruption' });
      }
    } catch (error) {
      return resp.json({ status: false, message: error.message });
    }
  },




  checkout: async (req, resp) => {
    try {
      const id = req.session.user.id;
      const result = await Cart.find({ user: id }).populate('productId');
      if (result) {
        var addressess;
        var oldaddress = await Address.find({ user: id, type: 'shipping' });
        if (oldaddress) {
          addressess = oldaddress;
        } else {
          addressess = [];
        }
        resp.render('./frontend/cart/checkout', {
          title: 'Checkout',
          cartItems: result,
          addressess
        });
      } else {
        resp.redirect('/');
      }
    } catch (error) {
      req.session.message = {
        type: 'error',
        message: 'Server Error'
      };
      resp.redirect('/');
    }
  },

  // Paypal Checkout
  checkoutPost: async (req, res, next) => {
    try {
      const { oldaddress, payment_method } = req.body;
      if (oldaddress && payment_method) {
        const address = await Address.findById(oldaddress);
        const userId = req.session.user?._id;
        if (address && userId) {
          const cartItems = await Cart.find({ user: userId });
          if (cartItems.length) {
            let linequantity = 0;
            let amount = 0;
            let productName = '';
            for (const item of cartItems) {
              const product = await Product.findById(item.productId);
              if (product) {
                linequantity += item.quantity;
                amount += product.price * item.quantity;
                productName += `${product.title}, `;
              } else {
                req.session.message = {
                  type: 'error',
                  message: 'Product not found or some error occurred',
                };
                return res.redirect('/cart/checkout');
              }
            }
            const createPaymentJson = {
              intent: 'sale',
              payer: { payment_method: 'paypal' },
              redirect_urls: {
                return_url: process.env.SUCCESS_URL,
                cancel_url: process.env.CANCEL_URL,
              },
              transactions: [
                {
                  item_list: {
                    items: [
                      {
                        name: productName.slice(0, -2),
                        price: amount.toFixed(2),
                        currency: 'USD',
                        quantity: 1,
                      },
                    ],
                  },
                  amount: {
                    currency: 'USD',
                    total: amount.toFixed(2),
                  },
                  description: 'Payment description',
                },
              ],
            };
            paypal.payment.create(createPaymentJson, async (error, payment) => {
              if (error) {
                next(error);
              } else {

                const cartItems = await Cart.find({ user: userId });
                const products = await Product.find({ _id: { $in: cartItems.map(item => item.productId) } });
                const address = await Address.findById(req.body.oldaddress);

                const order = new Order({
                  user: userId,
                  address: address,
                  products: products.map((product, index) => ({
                    product: product,
                    quantity: cartItems[index].quantity
                  })),
                  amount: payment.transactions[0].amount.total,
                  paymentId: payment.id,
                  status: 'pending'
                });
                await order.save();
                const approvalUrl = payment.links.find(link => link.rel === 'approval_url')?.href;
                if (approvalUrl) {
                  res.redirect(approvalUrl);
                } else {
                  next(new Error('No approval URL found in payment response'));
                }
              }
            });
          } else {
            req.session.message = {
              type: 'error',
              message: 'Cart is empty',
            };
            return res.redirect('/cart/checkout');
          }
        } else {
          req.session.message = {
            type: 'error',
            message: 'Please log in and select a valid address',
          };
          return res.redirect('/cart/checkout');
        }
      } else {
        req.session.message = {
          type: 'error',
          message: 'Please provide an address and payment method',
        };
        return res.redirect('/cart/checkout');
      }
    } catch (error) {
      next(error);
    }
  },
  success: async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const userId = req.session.user?._id;
    const cartItems = await Cart.find({
      user: userId
    });
    let linequantity = 0;
    let amount = 0;
    let productName = '';
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        linequantity += item.quantity;
        amount += product.price * item.quantity;
        productName += `${product.title}, `;
      } else {
        req.session.message = {
          type: 'error',
          message: 'Product not found or some error occurred',
        };
        return res.redirect('/cart/checkout');
      }
    }

    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
        "amount": {
          "currency": "USD",
          "total": amount.toFixed(2)
        }
      }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
      if (error) {
        req.session.message = {
          type: 'error',
          message: 'Error occured while processing payment if your money got debited then it will be refunded within 2-3 working days.',
        };
        return res.redirect('/cart');
      } else {
        // Save the order and clear the cart
        try {
          const userId = req.session.user._id;
          Order.findOne({
            user: userId,
            status: 'pending'
          })
            .sort({
              '_id': -1
            })
            .limit(1)
            .populate('products.product')
            .populate('address')
            .exec(async (err, order) => {
              if (err) {
                req.session.message = {
                  type: 'error',
                  message: 'May Your product got purchased but some error occured check your orders list or try to contact us',

                };
                return res.redirect('/cart');
              }
              order.status = 'Success';
              order.payer = payment.payer;
              order.transactions = payment.transactions;
              order.invoice = order._id+'-invoice.pdf';
              await order.save();
              await Cart.deleteMany({
                user: userId
              });
               sendMail(order);
              // console.log(order.products)


              req.session.message = {
                type: 'success',
                message: 'Payment successful, order placed successfully'
              };
              return res.render('./frontend/cart/success', { title: 'Order Placed', order });
            });
        } catch (error) {
          req.session.message = {
            type: 'error',
            message: error.message || 'Internal Server Error'
          };
          return res.redirect('/cart');
        }
      }
    });
  },
  cancel: (req, resp) => {
    return resp.render('./frontend/cart/cancel',
      { title: 'Order Cancelled' });

  },


}
