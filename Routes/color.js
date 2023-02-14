const express = require("express");
const router = express.Router();
const Color = require("../Models/Color");
const auth = require("../Middleware/auth");
const adminAuth = require("../Middleware/adminAuth");
const ApiError = require("../Middleware/ApiError");

router.get("/", async (req, res) => {
  try {
    const color = await Color.find();
    res.send(color);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/", adminAuth, async (req, res) => {
  try {
    var color = new Color({
      name: req.body.name,
    });
    color = await color.save();
    res.send(color);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    res.send(color);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.put("/:id", adminAuth, async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true }
    );
    res.send(color);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const color = await Color.findByIdAndRemove(req.params.id);
    res.send(color);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

module.exports = router;
