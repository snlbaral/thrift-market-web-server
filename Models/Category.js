
const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name:{type:String,required:true},
    slug:{type:String,required:true},
    image:{type:String},
    parent_id:{type:mongoose.Schema.Types.ObjectId, ref:'category'},
    cover:{type:String},
    productcount:{type:Number,default:0}
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
)

//Relation
categorySchema.virtual('childrens', {
    ref: 'category',
    localField: '_id',
    foreignField: 'parent_id',
});


//IMP nested array
const childPopulate =  function(next){
    this.populate('childrens')
    next()
}


categorySchema.pre('findOne',childPopulate).pre('find',childPopulate)



const Category = mongoose.model('category',categorySchema)

module.exports = Category


