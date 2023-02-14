const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  door: { type: Number, require: true },
  branch: { type: Number, require: true },
  days: { type: String, require: true, default: "2-3 Days" },
});

const Shipping = mongoose.model("shipping", shippingSchema);

module.exports = Shipping;
