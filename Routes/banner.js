const express = require("express");
const router = express.Router();
const Banner = require("../Models/Banner");
const auth = require("../Middleware/auth");
const adminAuth = require("../Middleware/adminAuth");
const ApiError = require("../Middleware/ApiError");
const Joi = require("joi");
const { fileUploadFormData, removeFile } = require("../Middleware/helpers");

router.get("/", async (req, res) => {
  try {
    const banner = await Banner.find().sort("-_id");
    res.json(banner);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/", adminAuth, async (req, res) => {
  try {
    var schema = Joi.object({
      title: Joi.string().required(),
      link: Joi.string().required(),
      section: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return ApiError(res, 400, error.message);
    }
    if (!req.files && !req.files.image) {
      return ApiError(res, 400, "Image is required.");
    }
    // File Upload
    const image = req.files.image;
    const { status, data } = await fileUploadFormData(image);
    if (status !== 200) {
      return ApiError(res, 400, data);
    }

    var banner = new Banner({
      title: req.body.title,
      image: data,
      link: req.body.link,
      section: req.body.section,
    });
    banner = await banner.save();
    res.json(banner);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    res.json(banner);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.put("/:id", adminAuth, async (req, res) => {
  try {
    var schema = Joi.object({
      title: Joi.string().required(),
      link: Joi.string().required(),
      section: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return ApiError(res, 400, error.message);
    }
    if (req.files && req.files.image) {
      // File Upload
      const image = req.files.image;
      const { status, data } = await fileUploadFormData(image);
      if (status !== 200) {
        return ApiError(res, 400, data);
      }
      var picture = data;
    } else {
      var picture = req.body.image;
    }
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        link: req.body.link,
        image: picture,
        section: req.body.section,
      },
      { new: true }
    );
    res.json(banner);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndRemove(req.params.id);
    removeFile(banner.image);
    res.json(banner);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

module.exports = router;
