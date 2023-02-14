const mongoose = require('mongoose')
const districtSchema = new mongoose.Schema({
    district:{type:String,required:true}
})

const District = mongoose.model('district',districtSchema)

module.exports= District
