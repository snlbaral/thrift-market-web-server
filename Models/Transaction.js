const mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");

const transactionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    seller_id: { type: [], required: true },
    total: { type: Number, required: true },
    shipping: { type: Number },
    transaction_id: { type: String, required: true },
    payment_method: { type: String, required: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
    invoice_id: { type: Number, default: 0000000000 },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

transactionSchema.virtual("orders", {
  ref: "order",
  localField: "_id",
  foreignField: "transaction_id",
});

transactionSchema.virtual("addresses", {
  ref: "orderaddress",
  localField: "_id",
  foreignField: "transaction_id",
});

autoIncrement.initialize(mongoose.connection);
transactionSchema.plugin(autoIncrement.plugin, {
  model: "transaction",
  field: "invoice_id",
  startAt: 0000000001,
  incrementBy: 1,
});
const Transaction = mongoose.model("transaction", transactionSchema);
module.exports = Transaction;
