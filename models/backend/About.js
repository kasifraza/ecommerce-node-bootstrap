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
});
module.exports = mongoose.model('About',aboutSchema);