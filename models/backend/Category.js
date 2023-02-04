const mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');
const categorySchema = new mongoose.Schema({
    title:{
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
    }
});
categorySchema.plugin(URLSlugs('title'));
module.exports = mongoose.model('Category',categorySchema);