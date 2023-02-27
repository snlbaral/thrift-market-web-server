const express = require("express");
const router = express.Router();
const City = require("../Models/City");
const auth = require("../Middleware/auth");
const adminAuth = require("../Middleware/adminAuth");
const ApiError = require("../Middleware/ApiError");

router.get("/", auth, async (req, res) => {
  try {
    const city = await City.find().populate("district_id");
    res.json(city);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/", adminAuth, async (req, res) => {
  try {
    var city = new City({
      city: req.body.city,
      district_id: req.body.district,
    });
    city = await city.save();
    res.json(city);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    res.json(city);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.put("/:id", adminAuth, async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(
      req.params.id,
      {
        city: req.body.city,
        district_id: req.body.district_id,
      },
      { new: true }
    );
    res.json(city);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const city = await City.findByIdAndRemove(req.params.id);
    res.json(city);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

module.exports = router;
