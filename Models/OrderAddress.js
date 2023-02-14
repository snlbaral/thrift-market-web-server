const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  phone: { type: Number, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  name: { type: String, required: true },
  municipality: { type: String, required: true },
  zipcode: { type: Number, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  type: { type: String, required: true },
  transaction_id: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const OrderAddress = mongoose.model("orderaddress", addressSchema);

module.exports = OrderAddress;
