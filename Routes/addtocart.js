const express = require("express");
const router = express.Router();
const Addtocart = require("../Models/Addtocart");
const auth = require("../Middleware/auth");
const Product = require("../Models/Product");
const ApiError = require("../Middleware/ApiError");
const Joi = require("joi");

router.post("/cart", auth, async (req, res) => {
  try {
    var schema = Joi.object({
      pid: Joi.string().required(),
      quantity: Joi.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return ApiError(res, 400, error.message);
    }

    const product = await Product.findById(req.body.pid)
      .populate("size_id")
      .populate("color_id");
    if (product.stock <= 0) {
      return ApiError(res, 410, "Product out of stock");
    }
    const cart_pid = await Addtocart.findOne({
      product_id: product._id,
      user_id: req.user._id,
    });
    if (cart_pid) {
      cart_pid.quantity = cart_pid.quantity + req.body.quantity;
      cart_pid.save();
      return res.send(cart_pid);
    }

    var addtocart = new Addtocart({
      user_id: req.user._id,
      product_id: product._id,
      price: product.price,
      color: product.color_id.name,
      discount: product.discount,
      size: product.size_id.name,
      sku: product.sku,
      seller_id: product.seller_id,
      category_id: product.category_id,
      quantity: req.body.quantity,
      earning: product.earning,
    });

    addtocart = await addtocart.save();
    res.send(addtocart);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.get("/cartcount", auth, async (req, res) => {
  try {
    var cartcount = await Addtocart.find({ user_id: req.user._id })
      .populate("product_id")
      .populate("user_id");
    res.json(cartcount);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.delete("/cartremove/:id", auth, async (req, res) => {
  try {
    cartremove = await Addtocart.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });
    res.json("success");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

module.exports = router;
