const express = require('express');
const router = express.Router();
const deafultcontroller = require('../../controllers/frontend/deafultcontroller');
const blogcontroller = require('../../controllers/frontend/blogcontroller');
router.all('/*',(req,resp,next) => {
    req.app.set('layout', './layouts/layout')
    next();
});

// Index Page
router.route('/')
    .get(deafultcontroller.index);

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


module.exports = router;