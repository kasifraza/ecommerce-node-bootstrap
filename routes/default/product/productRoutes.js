const express = require('express');
const router = express.Router();
const productcontroller = require('../../../controllers/frontend/productcontroller');
router.all('/*',(req,resp,next) => {
    req.app.set('layout', './layouts/layout')
    next();
});

// Index Page
router.route('/')
    .get(productcontroller.index);

// Category All items Page
router.route('/category/:slug')
    .get(productcontroller.categoryslug);

// Single Product Page
router.route('/product/:slug')
    .get(productcontroller.view);



module.exports = router;