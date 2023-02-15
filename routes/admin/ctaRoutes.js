const express = require("express");
const router = express.Router();
const multer = require("multer");
const ctacontroller = require("../../controllers/backend/ctacontroller");

var ctaStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "assets/uploads/cta/");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + file.originalname);
    },
  });
  
  // initialize the upload middleware
  var ctaUpload = multer({ storage: ctaStorage });

//   All CTA Index Page
  router
    .route("/")
    .get(ctacontroller.index);
  router
    .route("/index")
    .get(ctacontroller.index);

//  CTA Create Page
    router
    .route('/create')
    .get(ctacontroller.create)
    .post(ctaUpload.single("image"), ctacontroller.createPost);

// CTA Update Page
    router
   .route("/update/:id")
    .get(ctacontroller.update)
    .post(ctaUpload.single("image"), ctacontroller.updatePost);


//  CTA View Page
  router
  .route("/view/:id")
  .get(ctacontroller.view);

module.exports = router;


