const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_admin: { type: Number, default: 0 },
    is_seller: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    image: { type: String },
    phone: { type: String, required: true, unique: true },
    role: { type: String },
    verifyKey: { type: String },
    cover: { type: String },
    bio: { type: String },
    pendingBalance: { type: Number, default: 0 },
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    interests: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
    gender: { type: String },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

userSchema.virtual("addresses", {
  ref: "address",
  localField: "_id",
  foreignField: "user_id",
});

userSchema.virtual("pickup", {
  ref: "PickupLocation",
  localField: "_id",
  foreignField: "user_id",
  justOne: true,
});

const PickupLocationPopulate = function () {
  this.populate("pickup");
};

userSchema
  .pre("find", PickupLocationPopulate)
  .pre("findOne", PickupLocationPopulate)
  .pre("findById", PickupLocationPopulate);

const User = mongoose.model("user", userSchema);

module.exports = User;
