const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    quantity: { type: Number },
    price: { type: Number },
    discount: { type: Number },
    color: { type: String },
    size: { type: String },
    brand: { type: String },
    sku: { type: String },
    note: { type: String },
    shipping_track_id: { type: String },
    order_status: { type: String, default: "processing" },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    payment_method: { type: String, default: "Direct" },
    shipping: { type: Number, default: 0 },
    earning: { type: Number, default: 0 },
    transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

orderSchema.virtual("addresses", {
  ref: "orderaddress",
  localField: "transaction_id",
  foreignField: "transaction_id",
});

const productPopulate = function () {
  this.populate("product_id");
};

orderSchema.pre("find", productPopulate);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
