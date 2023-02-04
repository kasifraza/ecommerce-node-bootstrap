const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    items : {
        type : Array,
        required : true
    },
    user : {
        required : true,
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    amount : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    }
},{timestamps : true});
module.exports = mongoose.model('Transaction',transactionSchema);