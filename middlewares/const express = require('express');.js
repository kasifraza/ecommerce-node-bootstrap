const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const upload = multer({
  storage: storage
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost/your-db-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a product schema
const productSchema = new mongoose.Schema({
  name: String,
  images: [String]
});

const Product = mongoose.model('Product', productSchema);

// Route to handle multiple image uploads for a product
app.post('/products/:id/images', upload.array('images', 10), (req, res, next) => {
  // Get the product by id
  Product.findById(req.params.id, (err, product) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    }

    if (!product) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    // Get the image names from the uploaded files
    let imageNames = [];
    req.files.forEach(file => {
      imageNames.push(file.path.replace('public', ''));
    });

    // Update the product with the image names
    product.images = product.images.concat(imageNames);
    product.save((err, updatedProduct) => {
      if (err) {
        return res.status(500).json({
          error: err
        });
      }
      res.status(200).json(updatedProduct);
    });
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
