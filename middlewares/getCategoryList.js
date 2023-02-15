const Category = require('../models/backend/Category');
const getCategoryList = function() {
    const categories = Category.find({status : true});
    // const categories = [
    //     'jkhjhj','dvfsv',
    //     1.2,433
    // ];
    // console.log(categories);
    if(categories) {
        return categories;
    }else{
        return [];
    }

};
module.exports = getCategoryList;  