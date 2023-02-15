const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    paymentId: { type: String, required: true },
    status :{
        type : 'String',
        required : true,
        enum : ['pending', 'Success', 'Refunded'],
    },
    payer:[],
    transactions:[],
    invoice:{
        type:String,
        
    }
},{timestamps: true});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
