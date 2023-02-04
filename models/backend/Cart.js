const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    user:{
         type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    productId:{
        // required:true,
        // type:String
        type: mongoose.Schema.Types.ObjectId, ref: 'Product'
    },
    quantity:{
        required:true,
        type:Number
    },
    subTotal : {
        required : true,
        type: String
    }
},{timestamps : true});
async function findUserCart(user){
    return Cart.find({user});
}

module.exports = mongoose.model('Cart',cartSchema);