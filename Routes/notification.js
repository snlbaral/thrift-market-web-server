const express = require("express");
const auth = require("../Middleware/auth");
const router = express.Router();
const Notification = require("../Models/Notification");
const mongoose = require("mongoose");
const OrderNotification = require("../Models/OrderNotification");
const ApiError = require("../Middleware/ApiError");

router.post("/", auth, async (req, res) => {
  try {
    var perPage = 36;
    var pageNo = 0;
    if (req.body.pageNo) {
      pageNo = req.body.pageNo - 1;
    }
    var notification = await Notification.aggregate([
      {
        $match: {
          user_id: mongoose.Types.ObjectId(req.user._id),
        },
      },

      {
        $group: {
          _id: {
            type: "$type",
            post_id: "$post_id",
          },
          count: {
            $sum: 1,
          },
          post_id: {
            $last: "$post_id",
          },
          user_id: {
            $last: "$user_id",
          },
          follower_id: {
            $last: "$follower_id",
          },
          type: {
            $last: "$type",
          },
          updatedAt: {
            $last: "$updatedAt",
          },
          createdAt: {
            $last: "$createdAt",
          },
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
          from: "users",
          localField: "follower_id",
          foreignField: "_id",
          as: "follower",
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "post_id",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $unwind: {
          path: "$post",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "post.brand_id",
          foreignField: "_id",
          as: "post.brand_id",
        },
      },
      {
        $unwind: {
          path: "$post.brand_id",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $unwind: {
          path: "$follower",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "sizes",
          localField: "post.size_id",
          foreignField: "_id",
          as: "post.size_id",
        },
      },
      {
        $unwind: {
          path: "$post.size_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "colors",
          localField: "post.color_id",
          foreignField: "_id",
          as: "post.color_id",
        },
      },
      {
        $unwind: {
          path: "$post.color_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "post._id",
          foreignField: "post_id",
          as: "post.likes",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "post.seller_id",
          foreignField: "_id",
          as: "post.seller_id",
        },
      },
      {
        $unwind: {
          path: "$post.seller_id",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    res.json(notification);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.get("/count", auth, async (req, res) => {
  try {
    var normalNotificationCount = await Notification.countDocuments({
      user_id: req.user._id,
      unread: true,
    });
    var orderNotificationCount = await OrderNotification.countDocuments().or([
      { seller_id: req.user._id, type: "order", unread: true },
      { user_id: req.user._id, type: "shipped", unread: true },
      { user_id: req.user._id, type: "completed", unread: true },
      { seller_id: req.user._id, type: "completed", unread: true },
    ]);
    var count = normalNotificationCount + orderNotificationCount;
    res.json({
      total: count,
      normalNotificationCount: normalNotificationCount,
      orderNotificationCount: orderNotificationCount,
    });
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// notification read
router.get("/read", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user._id, unread: true },
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

module.exports = router;
