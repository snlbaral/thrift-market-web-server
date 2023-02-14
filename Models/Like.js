const mongoose = require('mongoose')

const likesSchema = new mongoose.Schema({
    type: {type:String, required: true},
    post_id: {type:mongoose.Schema.Types.ObjectId, ref:'product'},
    comment_id: {type:mongoose.Schema.Types.ObjectId, ref:'comment'},
    user_id: {type:mongoose.Schema.Types.ObjectId, required: true, ref: 'user'}
},{timestamps:true})



const Like = mongoose.model('like',likesSchema)
module.exports= Like