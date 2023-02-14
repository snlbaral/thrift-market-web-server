const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
    user_id: {type:mongoose.Schema.Types.ObjectId, required: true, ref: 'user'},
    post_id: {type:mongoose.Schema.Types.ObjectId, required: true, ref: 'product'},
    comment: {type:String, required: true},
    likes_count: {type:Number, default: 0},
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps:true
})

//Relation
commentsSchema.virtual('user', {
    ref: 'user',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

commentsSchema.virtual('likes',{
    ref:'like',
    localField:'_id',
    foreignField:'comment_id',
})

 
const userPopulate =  function(){
    this.populate('user')
    this.populate('likes')
    
}
commentsSchema.pre('findOne',userPopulate).pre('find',userPopulate)


const Comment = mongoose.model('comment',commentsSchema)
module.exports= Comment