const express = require('express');
const { loginValidate, registerValidate, createAddressValidate } = require('../../../helpers/v1/userValidation');
const { isAddress, isCategory, isProductInStock, isItemExistInCart, isProductInStockByPost, isCart } = require('../../../middlewares/v1/isValid');
const router = express.Router();
isAuthenticated = require('../../../middlewares/v1/isAuthenticated');
usercontroller = require('../../../controllers/v1/usercontroller');
shopcontroller = require('../../../controllers/v1/shopcontroller');
cartcontroller = require('../../../controllers/v1/cartcontroller');
blogcontroller = require('../../../controllers/v1/blogcontroller');
router.all("/*", (req, resp, next) => {
    req.app.set('layout', false)
    next();
});

/** 
 * @dev Kasif Raza
 * 
 *  **/

/**
 *  Route : USER
 *  CONTROLLER : USER
 *  CONTROLLER PATH : ROOT_DIR/controllers/frontend/v1/usercontroller.js
**/ 
router.route('/user/login')
    .post(loginValidate ,usercontroller.login);

router.route('/user/register')
    .post(registerValidate,usercontroller.register);
    
router.route('/user/change-password')
    .put(isAuthenticated, usercontroller.changePassword);

router.route('/user/update-profile')
    .put(isAuthenticated, usercontroller.updateUser);

router.route('/user/create-address')
    .post(isAuthenticated, createAddressValidate ,usercontroller.createAddress);

router.route('/user/update-address/:id')
   .put(isAuthenticated,isAddress,createAddressValidate, usercontroller.updateAddress);

router.route('/user/view-address/:id')
   .get(isAuthenticated,isAddress, usercontroller.viewAddress);

router.route('/user/all-address')
   .get(isAuthenticated, usercontroller.allAddress);




/**
 *  Route : SHOP
 *  CONTROLLER : SHOP
 *  CONTROLLER PATH : ROOT_DIR/controllers/frontend/v1/shopcontroller.js
**/ 

router.route('/shop/products')
    .get(shopcontroller.getAllProducts);

router.route('/shop/product/:id')
    .get(shopcontroller.getSingleProduct);

router.route('/shop/categories')
    .get(shopcontroller.getAllCategories);

router.route('/shop/category/:id')
    .get(isCategory,shopcontroller.getSingleCategory);



        
/**
 *  Route : CART
 *  CONTROLLER : CART
 *  CONTROLLER PATH : ROOT_DIR/controllers/frontend/v1/cartcontroller.js
**/  

router.route('/cart')
   .get(isAuthenticated,cartcontroller.getCart);


router.route('/cart/add-to-cart/:id')
    .get(isAuthenticated,isProductInStock,isItemExistInCart,cartcontroller.addToCartSingleQuantity);

router.route('/cart/add-to-cart')
.post(isAuthenticated,isProductInStockByPost,isItemExistInCart,cartcontroller.addToCartWithQuantity);


router.route('/cart/increment')
    .put(isAuthenticated,isCart,cartcontroller.incrementQuantity)

router.route('/cart/decrement')
    .put(isAuthenticated,isCart,cartcontroller.decrementQuantity)




/**
 *  Route : BLOGS
 *  CONTROLLER : BLOG
 *  CONTROLLER PATH : ROOT_DIR/controllers/frontend/v1/blogcontroller.js
**/  

router.route('/blogs')
    .get(blogcontroller.index);

        



    

    





module.exports = router;