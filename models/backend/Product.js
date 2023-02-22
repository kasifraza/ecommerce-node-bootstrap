const mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');
const productSchema = new mongoose.Schema({
    category:{
        // required:true, 
        // type:String
         type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },
    brand:{
        // required:true, 
        // type:String
         type: mongoose.Schema.Types.ObjectId, ref: 'Brand'
    },
    title:{
        required:true,
        type:String
    },
    short_description:{
        required:true,
        type:String
    },
    stock:{
        required:true,
        type:Boolean
    },
    price:{
        required:true,
        type:String
    },
    oldprice:{
        required:true,
        type:String
    },
    sku:{
        type:String
    },
    additional:{
        required:true,
        type:String
    },
    description:{
        required:true,
        type:String
    },
    status:{
        type:Boolean,
        required:true
    },
    created_on:{
        type:Date,
        required:true,
        default:Date.now
    },
    image:{
        type:String,
    },
    images: [],
    mark :{
        type:String,
        default:false,
        enum : ['HOT','SALE']

    },
    seo_title :{
        type:String,
    },
    seo_description : {
        type:String,
    },
    seo_keywords:{
        type:String,
    }
});
productSchema.plugin(URLSlugs('title'));
module.exports = mongoose.model('Product',productSchema);