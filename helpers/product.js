// helpers/product.js
const Product = require('../models/backend/Product');

const checkProduct = async (productId) => {
    try {
        // Find the product in the MongoDB product collection
        const product = await Product.findOne({ _id: productId });
        
        if (!product) {
            return { error: 'Product Not Found' };
        }
        
        if (!product.stock == true) {
            return { error: 'Product is out of stock' };
        }
        
        return product;
    } catch (err) {
        // throw err;
        return { error: err.message };
    }
}

// cart.js

async function getProductDetails(cart) {
  const productDetails = [];
  for (let i = 0; i < cart.length; i++) {
    const product = await Product.findOne({ _id: cart[i].productId });
    if (product) {
      const qty = cart[i].quantity;
      productDetails.push([product, parseInt(qty)]);
    } else {
      cart.splice(i, 1);
    }
  }
  return productDetails;
}


module.exports = {
    checkProduct,
    getProductDetails
}
