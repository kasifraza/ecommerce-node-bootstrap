const mongoose = require('mongoose');
const commentSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        email : true,
        required : true
    },
    comment : {
        required : true,
        minlength : 2,
        type : String
    },
    blogId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    },
    status : {
        type : Boolean,
        required : true,
        default : false
    }
},{timestamps : true});

module.exports = mongoose.model('Comment', commentSchema);
