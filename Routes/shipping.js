const express = require("express");
const router = express.Router();
const Shipping = require("../Models/Shipping");
const User = require("../Models/User");
const PickupLocation = require("../Models/PickupLocation");
const auth = require("../Middleware/auth");
const adminAuth = require("../Middleware/adminAuth");
const ApiError = require("../Middleware/ApiError");

router.get("/", auth, async (req, res) => {
  try {
    const shipping = await Shipping.find().limit(10);
    res.json(shipping);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.get("/:branch", auth, async (req, res) => {
  try {
    const shipping = await Shipping.find({
      from: new RegExp(req.params.branch, "i"),
    });
    res.json(shipping);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/price-list", auth, async (req, res) => {
  try {
    if (!Array.isArray(req.body.branches)) {
      ApiError(res, 400, "Bad Request");
    }
    const regex = req.body.branches.map((value) => new RegExp(value, "i"));
    const shipping = await Shipping.find({
      from: { $in: regex },
    });
    res.json(shipping);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/price-list/by-seller-ids", auth, async (req, res) => {
  try {
    if (!Array.isArray(req.body.sellers)) {
      return ApiError(res, 400, "Bad Request");
    }
    const locations = await PickupLocation.find({
      user_id: { $in: req.body.sellers },
    });
    const cities = [];
    locations.map((location) => {
      cities.push(location.city);
    });
    const regex = cities.map((value) => new RegExp(value, "i"));
    const shipping = await Shipping.find({
      from: { $in: regex },
    });
    res.json({ locations, shipping });
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/", auth, async (req, res) => {
  var schema = Joi.object({
    location: Joi.string().required(),
    fee: Joi.string().required(),
    days: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }

  try {
    var shipping = new Shipping({
      location: req.body.location,
      fee: req.body.fee,
      days: req.body.days,
    });

    shipping = await shipping.save();
    res.json(shipping);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const shipping = await Shipping.findById(req.params.id);
    res.json(shipping);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.put("/:id", auth, async (req, res) => {
  var schema = Joi.object({
    location: req.body.location,
    fee: req.body.fee,
    days: req.body.days,
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }

  try {
    const shipping = await Shipping.findByIdAndUpdate(
      req.params.id,
      {
        location: req.body.location,
        fee: req.body.fee,
        days: req.body.days,
      },
      { new: true }
    );
    res.json(shipping);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const shipping = await Shipping.findByIdAndRemove(req.params.id);
    res.json(shipping);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

module.exports = router;
