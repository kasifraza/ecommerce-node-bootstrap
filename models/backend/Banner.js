const mongoose = require('mongoose');
const bannerSchema = new mongoose.Schema({
    title : {
        required : true,
        type : String,
        maxlength : 30
    },
    description : {
        required : true,
        type : String,
        maxlength : 300
    },
    price : {
        required : true,
        type : Number
    },
    link : {
        type : String,
    },
    image : {
        type : String,
    }
},{timestamps : true}
);
module.exports = mongoose.model('Banner', bannerSchema);
