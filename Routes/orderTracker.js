const { Router } = require("express");
const router = Router();
const OrderTracker = require("../Models/OrderTracker");
const Authorization = require("../Middleware/auth");
const Transaction = require("../Models/Transaction");
const ApiError = require("../Middleware/ApiError");
const Order = require("../Models/Order");

// Get all orderTrackers
router.get("/", Authorization, async (req, res) => {
  try {
    const orderTrackers = await OrderTracker.find();
    res.send(orderTrackers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new orderTracker
router.post("/:id", Authorization, async (req, res) => {
  try {
    var order = await Order.findById(req.params.id);
    const orderTracker = await OrderTracker.create({
      user_id: order.user_id,
      seller_id: order.seller_id,
      transaction_id: order.transaction_id,
      message: req.body.message,
      order_id: order._id,
      product_id: order.product_id,
    });
    order.order_status = req.body.order_status;
    await order.save();

    res.send("success");
  } catch (error) {
    ApiError(res, 500, error.message, error);
  }
});

// Get orderTracker By ID
router.get("/:id", Authorization, async (req, res) => {
  try {
    const orderTracker = await OrderTracker.findById(req.params.id);
    res.send(orderTracker);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/order/:id", Authorization, async (req, res) => {
  try {
    const order = await OrderTracker.find({ order_id: req.params.id });
    res.send(order);
  } catch (error) {
    ApiError(res, 500, error.message, error);
  }
});

// Update orderTracker By ID
router.put("/:id", Authorization, async (req, res) => {
  try {
    const orderTracker = await OrderTracker.findByIdAndUpdate(
      req.params.id,
      {
        key: value,
      },
      { new: true }
    );
    res.send(orderTracker);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete orderTracker By ID
router.delete("/:id", Authorization, async (req, res) => {
  try {
    const orderTracker = await OrderTracker.findByIdAndDelete(req.params.id);
    res.send(orderTracker);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
