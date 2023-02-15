const express = require('express');
const router = express.Router();
const deafultcontroller = require('../../controllers/frontend/deafultcontroller');
const blogcontroller = require('../../controllers/frontend/blogcontroller');
// const Category = require('../../models/backend/Category');
router.all('/*',(req,resp,next) => {
    req.app.set('layout', './layouts/layout');    
    next();
});

// Index Page
router.route('/')
    .get(deafultcontroller.index);
router.route('/test')
.get((req,resp) => {
    req.app.set('layout', false);
    // req.app.set('categoryModel',Category);
    const catModel = req.app.get('categoryModel');
    const text = catModel.findById('63ce53f28edf203a7979770a')
    return resp.json(text)
});
    // About Page
router.route('/about-us')
    .get(deafultcontroller.about);

    // single blog view
router.route('/blog/:id')
    .get(blogcontroller.view);


    // All blogs 
router.route('/blogs')
    .get(blogcontroller.index);


    // Contact-US Page
router.route('/contact-us')
    .get(deafultcontroller.contact);


    // Enquiry Post Action
router.route('/enquiry')
    .post(deafultcontroller.enquiryPost);


module.exports = router;