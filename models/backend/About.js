const mongoose = require('mongoose');
const aboutSchema = new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:{
        required:true,
        type:String
    },
    updated_on:{
        type:Date,
        required:true,
        default:Date.now
    },
    seo_title:{
        type:String,
    },
    seo_description:{
        type:String,
    },
    seo_keywords:{
        type:String,
    }
},{timestamps:true});
module.exports = mongoose.model('About',aboutSchema);