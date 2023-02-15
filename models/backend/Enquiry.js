const mongoose = require('mongoose');
const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 2000
    },
    subject: {
        type: String,
    },
    status : {
        type: Boolean,
        default: false
    }
},{timestamps: true});

module.exports = mongoose.model('Enquiry', enquirySchema);
