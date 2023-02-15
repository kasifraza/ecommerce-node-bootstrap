const express = require("express");
const router = express.Router();
const multer = require("multer");
const brandcontroller = require("../../controllers/backend/brandcontroller");

var brandStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "assets/uploads/brands/");
    },
    filename: function (req, file, cb) {
      cb(null, 'Brand'+file.fieldname + "-" + Date.now() + file.originalname);
    },
  });
  
  // initialize the upload middleware
  var brandUpload = multer({ storage: brandStorage });

//   All Brand Index Page
  router
    .route("/")
    .get(brandcontroller.index);
  router
    .route("/index")
    .get(brandcontroller.index);

//  Brand Create Page
    router
    .route('/create')
    .get(brandcontroller.create)
    .post(brandUpload.single("image"), brandcontroller.createPost);

// Brand Update Page
    router
   .route("/update/:id")
    .get(brandcontroller.update)
    .post(brandUpload.single("image"), brandcontroller.updatePost);

// Brand Delete Page
    router
  .route("/delete/:id")
   .get(brandcontroller.delete)

//  Brand View Page
  router
  .route("/view/:id")
  .get(brandcontroller.view);

module.exports = router;


