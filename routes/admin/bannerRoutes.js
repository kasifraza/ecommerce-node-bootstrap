const express = require("express");
const router = express.Router();
const multer = require("multer");
const bannercontroller = require("../../controllers/backend/bannercontroller");

var bannerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "assets/uploads/banners/");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + file.originalname);
    },
  });
  
  // initialize the upload middleware
  var bannerUpload = multer({ storage: bannerStorage });

//   All Banners Index Page
  router
    .route("/")
    .get(bannercontroller.index);
  router
    .route("/index")
    .get(bannercontroller.index);

//  Banner Create Page
    router
    .route('/create')
    .get(bannercontroller.create)
    .post(bannerUpload.single("image"), bannercontroller.createPost);

// Banner Update Page
    router
   .route("/update/:id")
    .get(bannercontroller.update)
    .post(bannerUpload.single("image"), bannercontroller.updatePost);

// Banner Delete Page
    router
  .route("/delete/:id")
   .get(bannercontroller.delete)

//  Banner View Page
  router
  .route("/view/:id")
  .get(bannercontroller.view);

module.exports = router;


