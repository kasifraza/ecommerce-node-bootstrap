const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const multer = require("multer");
const admincontroller = require("../../controllers/backend/admincontroller");
const blogcontroller = require("../../controllers/backend/blogcontroller");
const categorycontroller = require("../../controllers/backend/categorycontroller");
const productcontroller = require("../../controllers/backend/productcontroller");
// require('./categoryRoutes');

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
router.route("/").get(admincontroller.index);

router.route("/index").get(admincontroller.index);

// about update page
router
  .route("/about/update")
  .get(admincontroller.about)
  .post(admincontroller.updateabout);

// blog create
router
  .route("/blog/create")
  .get(blogcontroller.create)
  .post(upload.single("image"), blogcontroller.createblog);

// blog update
router
  .route("/blog/update/:id")
  .get(blogcontroller.update)
  .post(upload.single("image"), blogcontroller.updateblog);

// blog delete with id
router
  .route('/blog/delete/:id')
  .get(blogcontroller.delete);


// blog index
router
  .route("/blog/index")
  .get(blogcontroller.index)
router
  .route("/blog")
  .get(blogcontroller.index)

// blog view
router
  .route("/blog/view/:id")
  .get(blogcontroller.view)


// CATEGORY

// category index page
router.route("/category").get(categorycontroller.index);

router.route("/category/index").get(categorycontroller.index);


// category create
router
  .route("/category/create")
  .get(categorycontroller.create)
  .post(upload.single("image"), categorycontroller.createcategory);

// category update
router
  .route("/category/update/:id")
  .get(categorycontroller.update)
  .post(upload.single("image"), categorycontroller.updatecategory);

// category delete with id
router
  .route('/category/delete/:id')
  .get(categorycontroller.delete);


// category index
router
  .route("/category/index")
  .get(categorycontroller.index)
router
  .route("/category")
  .get(categorycontroller.index)

// category view
router
  .route("/category/view/:id")
  .get(categorycontroller.view)



// PRODUCT

// product index page
router.route("/product").get(productcontroller.index);

router.route("/product/index").get(productcontroller.index);


// product create
router
  .route("/product/create")
  .get(productcontroller.create)
  .post(
  //   [
  //   body("title").notEmpty(),
  //   body("category").notEmpty(),
  //   body("price").isNumeric(),
  //   body("description").isString(),
  //   body("status").isBoolean(),
  //   body("stock").isBoolean(),
  //   body("additional").isString(),

  // ],
    upload.single("image"), productcontroller.createproduct);

// product update
router
  .route("/product/update/:id")
  .get(productcontroller.update)
  .post(upload.single("image"), productcontroller.updateproduct);

// product delete with id
router
  .route('/product/delete/:id')
  .get(productcontroller.delete);


// product index
router
  .route("/product/index")
  .get(productcontroller.index)
router
  .route("/product")
  .get(productcontroller.index)

// product view
router
  .route("/product/view/:id")
  .get(productcontroller.view)

module.exports = router;
