const Product = require('../../models/backend/Product');
const Category = require('../../models/backend/Category');
const Brand = require('../../models/backend/Brand');
module.exports = {

    // Shop page 
    index: async (req, resp, next) => {
        var perPage = 10;
        var page = req.query.page || 1;
        var brandId = req.query.brand || '';
        let query = Product.find()
            .populate('category')
            .skip((perPage * page) - perPage)
            .limit(perPage);
        if (req.query.sort) {
            query = query.sort(req.query.sort);
        }
        if (req.query.filter) {
            query = query.where(req.query.filter);
        }
        if(req.query.brand){
            query = query.where({brand: brandId});
        }
        if(req.query.hot){
            query = query.where({mark:'HOT'});
        }
        query.exec(async (err, products) => {
            Product.count().exec(async (err, count) => {
                if (err) {
                    const error = new Error('Error while finding products');
                    error.status = 500;
                    return next(error);
                }
                await resp.render('./frontend/product/shop', { title: 'SHOP', products, current: page, pages: Math.ceil(count / perPage), Category });
            });
        });
    },
    // Showing Category wise products using category slug
    categoryslug: async (req, resp, next) => {
        var slug = req.params.slug;
        Category.findOne({ slug: slug }).exec(async (err, category) => {
            if (err) {
                const error = new Error('Category Not Found');
                error.status = 404;
                return next(error);
            }
            const maincat = category;
            let query = Product.find({category:maincat._id})
            if (req.query.sort) {
                query = query.sort(req.query.sort);
            }
            var filter = '';
            if (req.query.filter) {
                if(req.query.filter === 'low'){
                    query.sort({price:1});
                    filter = 'low';
                }else if(req.query.filter === 'high'){
                    query.sort({price:-1});
                    filter = 'high';
                }else if(req.query.filter === 'latest'){
                    query.sort({created_on:-1});
                    filter = 'latest';
                }
                query = query.where(req.query.filter);
            }
            query.exec( async (err,products) => {
                if(err){
                    const error = new Error('Error occurs while searching for product in this Category');
                    error.status = 500;
                    return next(error);
                }
                Category.find({ status:true }).exec( async (err,categories) =>{
                    if(err){
                        const error = new Error('Error occurs while finding all categories');
                        error.status = 500;
                        return next(error);
                    }
                    const allcat = categories;
                    await resp.render('./frontend/product/category', {maincat,filter, allcategory: allcat, foundrecords: products.length, title: maincat.title, products});
                } );
            });
        });
    },
    // Show single product using slug
    view:async(req,resp,next)=>{
        var slug = req.params.slug;
        Product.findOne({ slug: slug }).populate('category').exec(async (err, product) => {
            if (err) {
                const error = new Error('Product Not Found');
                error.status = 404;
                return next(error);
            }
            Product.find({category:product.category._id}).populate('category').exec( async (err,relatedproduct) =>{
                if(err){
                    const error = new Error('Error occurs while finding all Related Products');
                    error.status = 500;
                    return next(error);
                }
                await resp.render('./frontend/product/productdetail.ejs', {product,relatedproducts:relatedproduct , title: product.title});
            } );
        });
    }
}