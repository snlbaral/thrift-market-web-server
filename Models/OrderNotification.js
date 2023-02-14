const mongoose = require('mongoose')

const orderNotification = new mongoose.Schema({
    'type':{type:String,required:true},
    'post_id':{type:mongoose.Schema.Types.ObjectId,required:true,ref:'product'},
    'seller_id':{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    'user_id':{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    'unread':{type:Boolean,default:true},
    'order_id':{type:mongoose.Schema.Types.ObjectId,required:true,ref:'order'}
},{timestamps:true})

const OrderNotification = mongoose.model('orderNotification',orderNotification)

module.exports = OrderNotification

