const mongoose = require('mongoose');
const fs = require('fs');
const Product = mongoose.model('Product');
exports.updateProductImage = async (req, res) => {
    const productId = req.params.id;
    const imageIndex = req.params.index;
    const newImage = req.file;
    // Retrieve the product record 
    const product = await Product.findById(productId);
    // Find the image in the images array
    const oldImage = product.images[imageIndex];
    // Update the image in the images array
    product.images[imageIndex] = newImage.path;
    // Save the updated product record
    await product.save();
    // Remove the old image from the folder
    fs.unlinkSync(oldImage);
    // Return a success response
    res.send({ success: true, message: 'Image updated successfully' });
};
exports.removeProductImage = async (req, res) => {
    const productId = req.params.id; const imageIndex = req.params.index;
    // Retrieve the product record
    const product = await Product.findById(productId);
    // Find the image in the images array 
    const imageToRemove = product.images[imageIndex];
    // Remove the image from the images array 
    product.images.splice(imageIndex, 1);
    // Save the updated product record
    await product.save();
    // Remove the image from the folder
    fs.unlinkSync(imageToRemove);
    // Return a success response
    res.send({ success: true, message: 'Image removed successfully' });
};