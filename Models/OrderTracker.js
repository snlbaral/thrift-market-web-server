const mongoose = require("mongoose");

const OrderTrackerSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "order",
    },
    transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "transaction",
    },
    message: { type: String, required: true },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product",
    },
  },
  {
    timestamps: true,
  }
);

const OrderTracker = mongoose.model("OrderTracker", OrderTrackerSchema);

module.exports = OrderTracker;
