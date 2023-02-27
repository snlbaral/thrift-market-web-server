const express = require("express");
const router = express.Router();
const Address = require("../Models/Address");
const auth = require("../Middleware/auth");
const Joi = require("joi");
const ApiError = require("../Middleware/ApiError");

router.get("/", auth, async (req, res) => {
  try {
    const address = await Address.find({ user_id: req.user._id });
    res.json(address);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/", auth, async (req, res) => {
  var schema = Joi.object({
    city: Joi.string().required(),
    phone: Joi.number().required(),
    district: Joi.string().required(),
    street: Joi.string().required(),
    name: Joi.string().required(),
    zipcode: Joi.number().required(),
    municipality: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }

  try {
    var address = new Address({
      user_id: req.user._id,
      city: req.body.city,
      phone: req.body.phone,
      district: req.body.district,
      street: req.body.street,
      name: req.body.name,
      zipcode: req.body.zipcode,
      municipality: req.body.municipality,
    });
    address = await address.save();
    res.json("success");
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.get("/edit/:id", auth, async (req, res) => {
  try {
    const address = await Address.findOne({
      user_id: req.user._id,
      _id: req.params.id,
    });
    res.json({ address });
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.put("/edit/:id", auth, async (req, res) => {
  var schema = Joi.object({
    city: Joi.string().required(),
    phone: Joi.number().required(),
    district: Joi.string().required(),
    street: Joi.string().required(),
    zipcode: Joi.number().required(),
    name: Joi.string().required(),
    municipality: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }

  try {
    const address = await Address.findOne({
      user_id: req.user._id,
      _id: req.params.id,
    });
    address.phone = req.body.phone;
    address.city = req.body.city;
    address.district = req.body.district;
    address.street = req.body.street;
    address.name = req.body.name;
    address.zipcode = req.body.zipcode;
    address.municipality = req.body.municipality;

    await address.save();
    res.json("success");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    var address = await Address.findOneAndRemove({
      _id: req.params.id,
      user_id: req.user._id,
    });
    res.json("success");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

module.exports = router;
