const Address = require('../../models/backend/Address');
const Category = require('../../models/backend/Category');
const Cart = require('../../models/backend/Cart');
const Product = require('../../models/backend/Product');
module.exports = {
    isAddress : async(req,res,next) => {
        try{
            if(req.params.id){
                const id = req.params.id;
                const address = await Address.findById(id);
                if(!address){
                    return res.status(404).json({message: 'Address not found'});
                }
                req.address = address;
                next();
            }else{
                return res.status(400).json({message: 'Address ID is required'});
            }
        }catch(err){
            return res.status(500).json({message: 'Error in getting address'});
        };
    },

    isCategory : async(req,res,next) => {
        try{
            if(req.params.id){
                const id = req.params.id;
                Category.findById(id).populate('products').then(category => {
                    req.category = category;
                    next();
                }).catch(err => {
                    return res.status(404).json({message: 'Category not found'});
                })
            }else{
                return res.status(400).json({message: 'Category ID is required'});
            }
        }catch(err){
            return res.status(500).json({message: 'Error in getting Category'});
        }
    },

    isProduct : async(req,res,next) => {
        try{
            if(req.params.id){
                const id = req.params.id;
                Product.findById(id).populate('category').then(product => {
                    req.product = product;
                    next();
                }).catch(err => {
                    return res.status(404).json({message: 'Product not found'});
                });

            }else{
                return res.status(400).json({message: 'Product ID is required'});
            }
        }catch(err){
            return res.status(500).json({message: 'Error in getting Product'});
        }
    },

    isProductInStock : async(req,res,next) => {
        try{
            if(req.params.id){
                const id = req.params.id;
                Product.findById(id).populate('category').then(product => {
                    if(!product.stock === true){
                        return res.status(404).json({message: 'Product Is Out Of Stock'});
                    }
                    req.product = product;
                    next();
                }).catch(err => {
                    return res.status(404).json({message: 'Product not found'});
                });

            }else{
                return res.status(400).json({message: 'Product ID is required'});
            }
        }catch(err){
            return res.status(500).json({message: 'Error while getting Product'});
        }
    },

    isProductInStockByPost : async(req,res,next) => {
        try{
            const { productId , quantity } = req.body;
            if(!productId){
                return res.status(400).json({message: 'Product ID is Missing from the request'});
            }
            if(!quantity){
                return res.status(400).json({message: 'Quantity is Missing from the request'});
            }
            const product = await Product.findById(productId);
            if(!product){
                return res.status(404).json({message: 'Product not found'});
            }
            if(!product.stock === true){
                return res.status(404).json({message: 'Product Is Out Of Stock'});
            }
            req.product = product;
            next();
        }catch(err){
            return res.status(500).json({message: 'Error while checking Product Stock'});
        }
    },

    isItemExistInCart: async (req, res, next) => {
        try {
          const { product, user } = req;
      
          if (!product || !user) {
            return res.status(422).json({ message: 'Product ID and User ID are required.' });
          }
      
          const productId = product._id;
          const userId = user._id;
          const cart = await Cart.findOne({ user: userId, productId: productId }).populate('productId');
      
          if (cart) {
            req.cart = cart;
          }
      
          next();
        } catch (err) {
          return res.status(500).json({ message: 'An error occurred while checking cart.' });
        }
    },

    isCart : async (req, res, next) => {
        try {
            const { user } = req;
            if (!user) {
                return res.status(422).json({ message: 'Without Login You can not Perform this action' });
            }
            const { cartId } = req.body;
            Cart.findById(cartId).populate('productId').then(cart => {
                req.cart = cart;
                next();

            }).catch(err => {
                return res.status(404).json({message: 'Cart not found'});
            });
        }catch(err){
            return res.status(500).json({message: 'Error in getting cart'});
        }
    }
}