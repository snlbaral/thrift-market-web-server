const mongoose = require('mongoose')


const withdrawSchema = new mongoose.Schema({
    seller_id:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    amount:{type:Number,required:true},
    status:{type:String,required:true,default:"pending"},
    payment_method:{type:String},
    account_detail:{type:String}

},{timestamps:true})

const Withdraw = mongoose.model('withdraw',withdrawSchema)
module.exports = Withdraw
