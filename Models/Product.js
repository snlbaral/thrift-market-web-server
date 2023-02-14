const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    sku: { type: String },
    detail: { type: String, required: true },
    image: { type: String, require: true },
    feature_image: { type: [], default: [] },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "brand" },
    color_id: { type: mongoose.Schema.Types.ObjectId, ref: "color" },
    size_id: { type: mongoose.Schema.Types.ObjectId, ref: "size" },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    type: { type: String, required: true },
    original: { type: Number },
    earning: { type: Number },
    likes_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
    pickupOption: { type: String, default: "Branch" },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

//Relation
productSchema.virtual("likes", {
  ref: "like",
  localField: "_id",
  foreignField: "post_id",
});

//Relation
productSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "post_id",
});
productSchema.virtual("brand", {
  ref: "brand",
  localField: "brand_id",
  foreignField: "_id",
  justOne: true,
});

productSchema.virtual("color", {
  ref: "color",
  localField: "color_id",
  foreignField: "_id",
  justOne: true,
});

productSchema.virtual("size", {
  ref: "size",
  localField: "size_id",
  foreignField: "_id",
  justOne: true,
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
