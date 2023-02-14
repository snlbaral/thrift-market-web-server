const mongoose = require('mongoose')
const tokenSchema = new mongoose.Schema({
   token:{type:String,required:true},
   user_id:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'}
})

const ExpoToken = mongoose.model('expotoken',tokenSchema)
module.exports = ExpoToken