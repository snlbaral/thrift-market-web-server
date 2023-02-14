const mongoose = require('mongoose')
const citySchema = new mongoose.Schema({
    city:{type:String,required:true},
    district_id:{type:mongoose.Schema.Types.ObjectId,ref:'district'}
})

const City = mongoose.model('city',citySchema)

module.exports= City