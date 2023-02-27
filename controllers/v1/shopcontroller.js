const Product = require('../../models/backend/Product');
const Category = require('../../models/backend/Category');
const fs = require('fs');
const request = require('request');
module.exports = {
    getAllProducts: async (req, res) => {
        try {
            let query = { status: true };
            const products = await Product.find(query)
                .populate('category')
                .populate('brand');

            if (products.length === 0) {
                return res.status(404).json({
                    message: 'No products found'
                });
            }
            return res.status(200).json(products);
        } catch (err) {
            return res.status(500).json({ message: 'Error in getting products' });
        }
    },
    

    getSingleProduct: async (req, res) => {
        try {
            if (req.params.id) {

                const product = await Product.findById(req.params.id)
                    .populate('category')
                    .populate('brand');

                if (!product) {
                    return res.status(404).json({
                        message: 'Product not found'
                    });
                }
                return res.status(200).json(product);
            } else {
                return res.status(400).json({
                    message: 'Product id is required'
                });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error in getting product' });
        }
    },


    getAllCategories :async(req,res) =>{
        try{
            const categories = await Category.find({status:true}).populate('products');
            if(categories.length === 0){
                return res.status(404).json({
                    message: 'No categories found'
                });
            }
            return res.status(200).json(categories);
        }catch(err){
            return res.status(500).json({message:'Error while getting categories'});
        };
    },


    getSingleCategory: async (req, res) => {
        try {
            if(req.category){
                return res.status(200).json({category : req.category});
            }else{
                return res.status(400).json({
                    message: 'Category Not Found'
                });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error while getting category' });
        }
    },
}