const express = require("express");
const ApiError = require("../Middleware/ApiError");
const auth = require("../Middleware/auth");
const router = express.Router();
const OrderNotification = require("../Models/OrderNotification");
const mongoose = require("mongoose");

router.post("/order", auth, async (req, res) => {
  try {
    var perPage = 36;
    var pageNo = 0;
    if (req.body.pageNo) {
      pageNo = req.body.pageNo - 1;
    }

    var notification = await OrderNotification.aggregate([
      {
        $match: {
          $or: [
            { user_id: mongoose.Types.ObjectId(req.user._id) },
            { seller_id: mongoose.Types.ObjectId(req.user._id) },
          ],
        },
      },

      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $skip: pageNo * perPage,
      },
      {
        $limit: perPage,
      },
      {
        $lookup: {
          from: "products",
          localField: "post_id",
          foreignField: "_id",
          as: "post_id",
        },
      },
      {
        $unwind: {
          path: "$post_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "post_id.brand_id",
          foreignField: "_id",
          as: "post_id.brand_id",
        },
      },
      {
        $unwind: {
          path: "$post_id.brand_id",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "sizes",
          localField: "post_id.size_id",
          foreignField: "_id",
          as: "post_id.size_id",
        },
      },
      {
        $unwind: {
          path: "$post_id.size_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "colors",
          localField: "post_id.color_id",
          foreignField: "_id",
          as: "post_id.color_id",
        },
      },
      {
        $unwind: {
          path: "$post_id.color_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "post_id._id",
          foreignField: "post_id",
          as: "post_id.likes",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "post_id.seller_id",
          foreignField: "_id",
          as: "post_id.seller_id",
        },
      },
      {
        $unwind: {
          path: "$post_id.seller_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_id",
        },
      },
      {
        $unwind: {
          path: "$user_id",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "seller_id",
          foreignField: "_id",
          as: "seller_id",
        },
      },
      {
        $unwind: {
          path: "$seller_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "order_id",
          foreignField: "_id",
          as: "order_id",
        },
      },
      {
        $unwind: {
          path: "$order_id",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    res.json(notification);
  } catch (error) {
    console.log(error.message);
    ApiError(res, 500, "Server Error", error);
  }
});

router.get("/read", auth, async (req, res) => {
  try {
    await OrderNotification.updateMany(
      { seller_id: req.user._id, type: "order", unread: true },
      {
        unread: false,
      },
      { multi: true }
    );
    await OrderNotification.updateMany(
      { user_id: req.user._id, type: "shipped", unread: true },
      {
        unread: false,
      },
      { multi: true }
    );
    await OrderNotification.updateMany(
      { user_id: req.user._id, type: "completed", unread: true },
      {
        unread: false,
      },
      { multi: true }
    );
    await OrderNotification.updateMany(
      { seller_id: req.user._id, type: "completed", unread: true },
      {
        unread: false,
      },
      { multi: true }
    );
    res.json("success");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// router.delete("/delete", auth, async (req, res) => {
//     try {

//     } catch (error) {

//     }
//   const order = await OrderNotification.deleteMany({ order_id: null });
//   res.json(order);
// });

module.exports = router;
