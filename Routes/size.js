const express = require("express");
const router = express.Router();
const Size = require("../Models/Size");
const auth = require("../Middleware/auth");
const adminAuth = require("../Middleware/adminAuth");
const ApiError = require("../Middleware/ApiError");

router.get("/", async (req, res) => {
  try {
    const size = await Size.find();
    res.json(size);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/", adminAuth, async (req, res) => {
  var schema = Joi.object({
    name: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }
  try {
    var size = new Size({
      name: req.body.name,
    });
    size = await size.save();
    res.json(size);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    res.json(size);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.put("/:id", adminAuth, async (req, res) => {
  var schema = Joi.object({
    name: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }

  try {
    const size = await Size.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true }
    );
    res.json(size);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const size = await Size.findOneAndDelete(req.params.id);
    res.json(size);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

module.exports = router;
