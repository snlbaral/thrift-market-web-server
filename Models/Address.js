const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  phone: { type: Number, required: true },
  district: { type: String, required: true },
  municipality: { type: String },
  city: { type: String, required: true },
  street: { type: String, required: true },
  name: { type: String, required: true },
  zipcode: { type: Number, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const Address = mongoose.model("address", addressSchema);

module.exports = Address;
