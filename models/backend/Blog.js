const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
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
    },
    seo_title:{
        type : String,
    },
    seo_description:{
        type : String,
    },
    seo_keywords:{
        type : String,
    }
},{timestamps:true});
module.exports = mongoose.model('Blog',blogSchema);