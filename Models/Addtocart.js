const mongoose = require('mongoose')

const addtocartSchema = new mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    product_id:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
    category_id:{type:mongoose.Schema.Types.ObjectId, ref:'category'},
    quantity:{type:Number},
    price:{type:Number},
    discount:{type:Number},
    color:{type:String},
    size:{type:String},
    sku:{type:String},
    fee:{type:Number},
    earning:{type:Number},
    seller_id:{type:mongoose.Schema.Types.ObjectId,ref:'user'}
},{timestamp:true})

const Addtocart = mongoose.model('addtocart',addtocartSchema)

module.exports= Addtocart