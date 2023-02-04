const mongoose = require('mongoose');
const Category = require('../models/backend/Category');

exports.getCategoryName =  function(cat_id) {
    // try {
    //     const category = await Category.findById(cat_id);
    //     console.log(category.title);
    //     return category.title;
    // } catch (err) {
    //     console.log(err);
    // }
    Category.findById(cat_id).then(category => {
        console.log(category.title);
        return category.title;
    }).catch(err => {
        console.log(err);
    });
};
