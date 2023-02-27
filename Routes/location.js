const { Router } = require("express");
const router = Router();
const Location = require("../Models/Location");
const auth = require("../Middleware/auth");
const adminAuth = require("../Middleware/adminAuth");
const Joi = require("joi");

// Get all locations
router.get("/", auth, async (req, res) => {
  try {
    const locations = await Location.find().sort("district");
    res.json(locations);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Create a new location
router.post("/", adminAuth, async (req, res) => {
  try {
    var schema = Joi.object({
      city: Joi.string().required(),
      district: Joi.string().required(),
      area: Joi.string().allow(null, ""),
      municipality: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json(error.message);
    }

    let location = new Location({
      city: req.body.city,
      district: req.body.district,
      municipality: req.body.municipality,
      area: req.body.area,
    });
    location = await location.save();
    res.json(location);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Get location By ID
router.get("/:id", auth, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    res.json(location);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Update location By ID
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      {
        city: req.body.city,
        district: req.body.district,
        municipality: req.body.municipality,
        area: req.body.area,
      },
      { new: true }
    );
    res.json(location);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Delete location By ID
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    res.json(location);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
