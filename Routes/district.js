const express = require("express");
const District = require("../Models/District");
const auth = require("../Middleware/auth");
const adminAuth = require("../Middleware/adminAuth");
const ApiError = require("../Middleware/ApiError");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const district = await District.find();
    res.json(district);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/", adminAuth, async (req, res) => {
  var schema = Joi.object({
    district: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }

  try {
    var district = new District({
      district: req.body.district,
    });
    district = await district.save();
    res.json(district);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const district = await District.findById(req.params.id);
    res.json(district);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.put("/:id", adminAuth, async (req, res) => {
  try {
    const district = await District.findByIdAndUpdate(
      req.params.id,
      {
        district: req.body.district,
      },
      { new: true }
    );
    res.json(district);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const district = await District.findByIdAndRemove(req.params.id);
    res.json(district);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

module.exports = router;
