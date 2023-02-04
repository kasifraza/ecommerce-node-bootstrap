const express = require('express');
const router = express.Router();
const apicontroller = require('../../controllers/frontend/apicontroller');
const isApiUser = require('../../middlewares/isApiUser');

// Shop Page Get API
router.route('/shop')
    .get(apicontroller.shop);

// create user address api
router.route('/user/create-address')
    .post(isApiUser,apicontroller.userAddress);

// Update user address api
router.route('/user/update-address/:id')
    .put(isApiUser,apicontroller.updateUserAddress);



module.exports = router;