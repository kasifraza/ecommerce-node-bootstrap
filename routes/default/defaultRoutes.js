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
    if(req.session.user){
        return resp.render('./frontend/default/chat',{title : "Test"});
    }
    req.session.message = {
        type : "error",
        message : "Please Login to See Chats"
    };
    return resp.redirect('/user/login');
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