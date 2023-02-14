const express = require("express");
const Product = require("../Models/Product");
const Like = require("../Models/Like");
const Comment = require("../Models/Comment");
const auth = require("../Middleware/auth");
const router = express.Router();
const Notification = require("../Models/Notification");
const mongoose = require("mongoose");
const ExpoToken = require("../Models/ExpoToken");
const axios = require("axios");
const ApiError = require("../Middleware/ApiError");
const { sendExpoToken } = require("../Middleware/helpers");

async function getNotificationById(id) {
  const notification = await Notification.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(id),
      },
    },
    { $limit: 1 },
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
      },
    },

    {
      $sort: {
        updatedAt: -1,
      },
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
  ]);
  if (notification.length > 0) {
    return notification[0];
  }
  return {};
}

// Like/Unlike Post/Product
router.post("/like/post/:id", auth, async (req, res) => {
  try {
    const post = await Product.findById(req.params.id);
    if (!post) return ApiError(res, 404, "Product not found");
    if (req.body.action == "like") {
      post.likes_count += 1;
      const alreadyLike = await Like.findOne({
        post_id: req.params.id,
        user_id: req.user._id,
      });
      if (!alreadyLike) {
        const like = new Like({
          type: "post",
          post_id: req.params.id,
          user_id: req.user._id,
        });
        await like.save();
        if (req.user._id != post.seller_id) {
          const notification = new Notification({
            type: "like",
            user_id: post.seller_id,
            follower_id: req.user._id,
            post_id: req.params.id,
          });
          await notification.save();
          var notificationPop = await getNotificationById(notification._id);
          req.sendNotification(post.seller_id, notificationPop);
        }
      }
    }
    if (req.body.action == "unlike" && post.likes_count > 0) {
      post.likes_count -= 1;
    }
    if (req.body.action == "unlike") {
      await Like.findOneAndDelete({
        type: "post",
        post_id: req.params.id,
        user_id: req.user._id,
      });
      await Notification.findOneAndDelete({
        type: "like",
        post_id: req.params.id,
        follower_id: req.user._id,
      });
    }
    await post.save();
    res.send("Success");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// Like/Unlike Comment
router.post("/like/comment/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return ApiError(res, 404, "Comment not found");
    if (req.body.action == "like") {
      comment.likes_count += 1;
      const like = new Like({
        type: "comment",
        comment_id: req.params.id,
        user_id: req.user._id,
      });
      await like.save();
    }
    if (req.body.action == "unlike" && comment.likes_count > 0) {
      comment.likes_count -= 1;
      await Like.findOneAndDelete({
        type: "comment",
        comment_id: req.params.id,
        user_id: req.user._id,
      });
    }
    await comment.save();
    res.json("Success");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// Get Comments
router.get("/comment/post/:id", auth, async (req, res) => {
  try {
    const comments = await Comment.find({ post_id: req.params.id }).sort(
      "-_id"
    );
    res.json(comments);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// Make a Comment
router.post("/comment/post/:id", auth, async (req, res) => {
  try {
    const post = await Product.findById(req.params.id);
    if (!post) return ApiError(res, 404, "Product not found");
    let comment = new Comment({
      user_id: req.user._id,
      post_id: req.params.id,
      comment: req.body.comment,
    });
    if (req.user._id != post.seller_id) {
      var notification = new Notification({
        user_id: post.seller_id,
        follower_id: req.user._id,
        type: "comment",
        post_id: req.params.id,
      });
      await notification.save();
      var notificationPop = await getNotificationById(notification._id);
      req.sendNotification(post.seller_id, notificationPop);

      const data = {
        type: "comment",
        post_id: post._id,
      };
      await sendExpoToken(
        post.seller_id,
        `${req.user.name} commented on your post`,
        req.body.comment,
        data
      );
    }

    comment = await comment.save();

    comment = await comment.populate("user").populate("likes").execPopulate();
    post.comments_count += 1;
    await post.save();
    res.json(comment);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// Delete a comment
router.delete("/comment/post/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Product.findById(req.params.post_id);
    if (!post) return ApiError(res, 404, "Product not found");
    const comment = await Comment.findOne({
      _id: req.params.comment_id,
      user_id: req.user._id,
    });
    if (!comment) return ApiError(res, 404, "Comment not found");
    await comment.delete();
    await Notification.findOneAndDelete({
      type: "comment",
      post_id: req.params.post_id,
      follower_id: req.user._id,
    });

    post.comments_count -= 1;
    await post.save();
    res.json("Success");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

module.exports = router;
