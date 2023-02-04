const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
    user : {
        required : true,
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    type : {
        required : true,
        type : String
    },
    firstname : {
        required:true,
        type:String
    },
    lastname : {
        required:true,
        type : String
    },
    street : {
        required : true,
        type: String
    },
    apartment : {
        required : false,
        type: String
    },
    city : {
        required : true,
        type : String
    },
    state : {
        required : true,
        type : String
    },
    zip : {
        required : true,
        type : String,
    },
    phone : {
        required :true,
        type : String
    },
    email : {
        required : true,
        type : String
    },
    notes : {
        required : false,
        type : String
    },
    checkoutid : {
        required : true,
        type : String
    },
    checkoutstatus : {
        required : true,
        enum : ['pending','success','failed'],
        default : 'pending',
        type : String
    }
},{timestamps : true});

module.exports = mongoose.model('Address',addressSchema);
