const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const multer = require("multer");
const admincontroller = require("../../controllers/backend/admincontroller");
const blogcontroller = require("../../controllers/backend/blogcontroller");
const categorycontroller = require("../../controllers/backend/categorycontroller");
const productcontroller = require("../../controllers/backend/productcontroller");
const errorHandler = require("../../middlewares/errorHandler");
const { uploadPhoto, productImgResize , singleProductImgResize } = require('../../middlewares/uploadImages');
const bannerRoutes =  require('./bannerRoutes');
const {isAdmin} = require('../../middlewares/isAdmin');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

// initialize the upload middleware
var upload = multer({ storage: storage });

// setting group middleware and changing layout 
router.all("/*", (req, resp, next) => {
  req.app.set('layout', './layouts/admin')
  next();
});


// admin index page
router.route("/").get(isAdmin,admincontroller.index);

// Admin Login
router
.route("/login")
.get(admincontroller.login)
.post(admincontroller.loginPost);

// admin logout
router
.route("/logout")
.get(admincontroller.logout);

// Admin Index

router.route("/index").get(isAdmin,admincontroller.index);

// about update page
router
  .route("/about/update")
  .get(isAdmin,admincontroller.about)
  .post(isAdmin,admincontroller.updateabout);

// blog create
router
  .route("/blog/create")
  .get(isAdmin,blogcontroller.create)
  .post(isAdmin,upload.single("image"), blogcontroller.createblog);

// blog update
router
  .route("/blog/update/:id")
  .get(isAdmin,blogcontroller.update)
  .post(isAdmin,upload.single("image"), blogcontroller.updateblog);

// blog delete with id
router
  .route('/blog/delete/:id')
  .get(isAdmin,blogcontroller.delete);


// blog index
router
  .route("/blog/index")
  .get(isAdmin,blogcontroller.index)
router
  .route("/blog")
  .get(isAdmin,blogcontroller.index)

// blog view
router
  .route("/blog/view/:id")
  .get(isAdmin,blogcontroller.view)


// CATEGORY

// category index page
router.route("/category").get(isAdmin,categorycontroller.index);

router.route("/category/index").get(isAdmin,categorycontroller.index);


// category create
router
  .route("/category/create")
  .get(isAdmin,categorycontroller.create)
  .post(isAdmin,upload.single("image"), categorycontroller.createcategory);

// category update
router
  .route("/category/update/:id")
  .get(isAdmin,categorycontroller.update)
  .post(isAdmin,upload.single("image"), categorycontroller.updatecategory);

// category delete with id
router
  .route('/category/delete/:id')
  .get(isAdmin,categorycontroller.delete);


// category index
router
  .route("/category/index")
  .get(isAdmin,categorycontroller.index)
router
  .route("/category")
  .get(isAdmin,categorycontroller.index)

// category view
router
  .route("/category/view/:id")
  .get(isAdmin,categorycontroller.view)



// PRODUCT

// product index page
router.route("/product").get(isAdmin,productcontroller.index);

router.route("/product/index").get(isAdmin,productcontroller.index);


// product create
router
  .route("/product/create")
  .get(isAdmin,productcontroller.create)
  .post(isAdmin,upload.single("image"), productcontroller.createproduct);

// product update
router
  .route("/product/update/:id")
  .get(isAdmin,productcontroller.update)
  .post(upload.single("image"), productcontroller.updateproduct);

// product delete with id
router
  .route('/product/delete/:id')
  .get(isAdmin,productcontroller.delete);

// product upload images with id
router
  .route('/product/upload-image/create/:id')
  .get(isAdmin,productcontroller.createProductImage)
  .post(isAdmin,uploadPhoto.array('images', 10),productImgResize,productcontroller.uploadProductImages);
// show all images of product using product id
router
 .route('/product/upload-image/:id')
 .get(isAdmin,productcontroller.indexProductImages);

//  update a particuler image from images array
router
 .route('/product/upload-image/update/:id/:index')
 .get(isAdmin,productcontroller.updateSingleProductImage)
 .post(isAdmin,uploadPhoto.single('image'),singleProductImgResize,productcontroller.updateSingleProductImagePost);

 
//  Delete a particuler image from images array
router
 .route('/product/upload-image/delete/:id/:index')
 .get(isAdmin,productcontroller.deleteSingleProductImage);


// product index
router
  .route("/product/index")
  .get(isAdmin,productcontroller.index)
router
  .route("/product")
  .get(isAdmin,productcontroller.index)

// product view
router
  .route("/product/view/:id")
  .get(isAdmin,productcontroller.view)

module.exports = router;
