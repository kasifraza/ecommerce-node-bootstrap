const mongoose = require('mongoose');
const testimonialSchema = new mongoose.Schema({
    title :{
        required: true,
        type: String,
        minlength: 5,
        maxlength: 50
    },
    description: {
        required: true,
        type: String,
        minlength: 10,
        maxlength: 200
    },
    name : {
        required: true,
        type: String,
        minlength: 4,
        maxlength: 30
    },
    designation: {
        required: true,
        type: String,
        minlength: 5,
        maxlength: 50
    }
},{timestamps : true});
module.exports = mongoose.model('Testimonial', testimonialSchema);