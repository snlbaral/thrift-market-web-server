const mongoose = require('mongoose')


const brandSchema = new mongoose.Schema({
    name:{type:String,required:true},
    slug:{type:String,required:true},
    image:{type:String},
    productcount:{type:Number,default:0}
})

const Brand = mongoose.model('brand',brandSchema)

module.exports = Brand
