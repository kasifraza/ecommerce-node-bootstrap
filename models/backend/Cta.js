const mongoose = require('mongoose');
const ctaSchema = new mongoose.Schema({
    title : {
        required : true,
        type : String
    },
    subtitle : {
        required : true,
        type : String
    },
    price : {
        required : true,
        type : Number
    },
    link : {
        required : true,
        type : String
    },
    image : {
        // required : true,
        type : String
    }
},{timestamps:true});
module.exports = mongoose.model('Cta',ctaSchema);