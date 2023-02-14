const mongoose = require('mongoose')
const bannerSchema = new mongoose.Schema({
    title:{type:String},
    image:{type:String,required:true},
    link:{type:String,required:true},
    section:{type:String,default:'top'}
})

const Banner = mongoose.model('banner',bannerSchema)

module.exports = Banner