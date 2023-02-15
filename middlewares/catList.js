const Category = require('../models/backend/Category');
const catlist = Category.find({});
module.exports = catlist; 