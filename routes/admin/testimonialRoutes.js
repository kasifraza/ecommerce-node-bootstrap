const express = require("express");
const router = express.Router();
const testimonialcontroller = require("../../controllers/backend/testimonialcontroller");


//   All Testimonial Index Page
  router
    .route("/")
    .get(testimonialcontroller.index);
  router
    .route("/index")
    .get(testimonialcontroller.index);

//  Testimonial Create Page
    router
    .route('/create')
    .get(testimonialcontroller.create)
    .post(testimonialcontroller.createPost);

// Testimonial Update Page
    router
   .route("/update/:id")
    .get(testimonialcontroller.update)
    .post(testimonialcontroller.updatePost);

// Testimonial Delete Page
    router
  .route("/delete/:id")
   .get(testimonialcontroller.delete)

//  Testimonial View Page
  router
  .route("/view/:id")
  .get(testimonialcontroller.view);

module.exports = router;


