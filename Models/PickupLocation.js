const mongoose = require("mongoose");

const PickupLocationSchema = new mongoose.Schema({
  phone: { type: Number, required: true },
  district: { type: String, required: true },
  municipality: { type: String },
  city: { type: String, required: true },
  street: { type: String, required: true },
  name: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const PickupLocation = mongoose.model("PickupLocation", PickupLocationSchema);

module.exports = PickupLocation;
