const mongoose = require('mongoose')
const notificationSchema = new mongoose.Schema({
    'user_id':{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    'post_id':{type:mongoose.Schema.Types.ObjectId,ref:'product'},
    'type':{type:String,required:true},
    'follower_id':{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    'unread':{type:Boolean,default:true}
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps:true
})

//Relation
notificationSchema.virtual('follower', {
    ref: 'user',
    localField: 'follower_id',
    foreignField: '_id',
    justOne:true
});

notificationSchema.virtual('post', {
    ref: 'product',
    localField: 'post_id',
    foreignField: '_id',
    justOne:true
});

const Notification = mongoose.model('notification',notificationSchema)

module.exports = Notification