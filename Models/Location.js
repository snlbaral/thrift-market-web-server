const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  district: { type: String, required: true },
  municipality: { type: String },
  area: { type: Array },
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
