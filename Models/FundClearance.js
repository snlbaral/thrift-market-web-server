const mongoose = require("mongoose");

const FundClearanceSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "order",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    amount: { type: Number, required: true },
    status: { type: String, default: "pending" },
    clearance_date: { type: String },
  },

  {
    timestamps: true,
  }
);

const FundClearance = mongoose.model("FundClearance", FundClearanceSchema);

module.exports = FundClearance;
