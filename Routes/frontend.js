const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");
const User = require("../Models/User");
const Product = require("../Models/Product");
const Brand = require("../Models/Brand");
const Order = require("../Models/Order");
const Transaction = require("../Models/Transaction");
const Category = require("../Models/Category");
const Banner = require("../Models/Banner");
const Addtocart = require("../Models/Addtocart");
const City = require("../Models/City");
const District = require("../Models/District");
const Color = require("../Models/Color");
const Size = require("../Models/Size");
const Joi = require("joi");
const ExpoToken = require("../Models/ExpoToken");
const ApiError = require("../Middleware/ApiError");
const FundClearance = require("../Models/FundClearance");
const Story = require("../Models/Story");
const mongoose = require("mongoose");
const { setRedisCache, getFromRedisCache } = require("../Middleware/redis");

router.post("/app/home/type", auth, async (req, res) => {
  try {
    const schema = Joi.object({
      activePage: Joi.number().required(),
      itemsCountPerPage: Joi.number().required(),
      type: Joi.string().required(),
      feedSetting: Joi.string().allow(null, ""),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json(error.message);
    itemsCountPerPage = req.body.itemsCountPerPage;
    activePage = req.body.activePage - 1;
    const user = await User.findById(req.user._id);
    var product_query;
    if (req.body.feedSetting == "following") {
      product_query = Product.find({
        seller_id: user.followings,
        type: req.body.type,
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(itemsCountPerPage)
        .skip(itemsCountPerPage * activePage)
        .sort("-_id");
    } else if (req.body.feedSetting == "interests") {
      product_query = Product.find({
        category_id: user.interests,
        type: req.body.type,
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(itemsCountPerPage)
        .skip(itemsCountPerPage * activePage)
        .sort("-_id");
    } else {
      product_query = Product.find({ type: req.body.type })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(itemsCountPerPage)
        .skip(itemsCountPerPage * activePage)
        .sort("-_id");
    }
    res.json({ product: await product_query.exec() });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

async function fundClearance() {
  try {
    var date = new Date().getTime();
    var funds = await FundClearance.find({
      status: "completed",
      clearance_date: { $lte: date },
    });
    for (const fund of funds) {
      const user = await User.findById(fund.seller_id);
      user.balance += fund.amount;
      user.pendingBalance = user.pendingBalance - fund.amount;
      await user.save();
      await fund.delete();
    }
  } catch (error) {}
}

async function removeOlderStories() {
  try {
    const hours = 24; // Number of hours
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);
    await Story.deleteMany({ createdAt: { $lt: cutoff } });
  } catch (error) {}
}

router.post("/app/home", auth, async (req, res) => {
  const schema = Joi.object({
    activePage: Joi.number().required(),
    itemsCountPerPage: Joi.number().required(),
    productOnly: Joi.boolean().allow(null, ""),
    feedSetting: Joi.string().allow(null, ""),
  });
  // TODO: Set up a cron job instead
  fundClearance();
  removeOlderStories();
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json(error.message);

  let feedSetting = "all";
  if (req.body.feedSetting === "followings") {
    feedSetting = "followings";
  } else if (req.body.feedSetting === "interests") {
    feedSetting = "interests";
  }

  // Check If Data is in Redis Cache
  const data = await getFromRedisCache(
    req,
    `APP_HOME:${req.body.activePage}:${req.user._id}:${feedSetting}`
  );
  if (data) return res.send(data);

  try {
    itemsCountPerPage = req.body.itemsCountPerPage;
    activePage = req.body.activePage - 1;
    const user = await User.findById(req.user._id);
    var product_query;
    if (req.body.feedSetting == "followings") {
      product_query = Product.find({ seller_id: user.followings })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(itemsCountPerPage)
        .skip(itemsCountPerPage * activePage)
        .sort("-_id");
    } else if (req.body.feedSetting == "interests") {
      product_query = Product.find({ category_id: user.interests })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(itemsCountPerPage)
        .skip(itemsCountPerPage * activePage)
        .sort("-_id");
    } else {
      product_query = Product.find()
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(itemsCountPerPage)
        .skip(itemsCountPerPage * activePage)
        .sort("-_id");
    }

    if (!req.body.productOnly) {
      const [product, stories] = await Promise.all([
        product_query.exec(),

        Story.aggregate([
          {
            $match: {
              user_id: { $in: [...user.followings, user._id] },
            },
          },
          {
            $group: {
              _id: {
                type: "$type",
                user_id: "$user_id",
              },
              stories: { $push: "$$ROOT" },
              count: {
                $sum: 1,
              },
              user_id: {
                $last: "$user_id",
              },
              user_image: {
                $last: "$user_image",
              },
              user_name: {
                $last: "$user_name",
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
        ]).exec(),
      ]);
      var newStories = [...stories];
      var index = newStories.findIndex(
        (story) => story.user_id == req.user._id
      );
      if (index != -1) {
        newStories.splice(index, 1);
        newStories.unshift(stories[index]);
      }
      // Set Data to Redis Cache
      setRedisCache(
        req,
        `APP_HOME:${req.body.activePage}:${req.user._id}:${feedSetting}`,
        {
          product,
          stories: newStories,
        }
      );
      return res.json({ product, stories: newStories });
    }

    res.json({ product: await product_query.exec() });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/materials/get", async (req, res) => {
  try {
    const materials = await Product.find({ type: "material" });
    res.send(materials);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// Homepage
router.get("/home", async (req, res) => {
  try {
    const redisKey = `WEB_HOME`;
    const data = await getFromRedisCache(req, redisKey);
    if (data) return res.json(data);
    const [product, brand, rentProduct, saleProduct, banner, categories] =
      await Promise.all([
        Product.find()
          .select("_id name price stock image type original")
          .populate({
            path: "brand_id",
            select: "_id name",
          })
          .limit(8)
          .sort("-_id")
          .exec(),
        Brand.find({ image: { $ne: null } })
          .limit(12)
          .sort("-_id")
          .exec(),
        Product.find({ type: "sale" })
          .select("_id name price stock image type original")
          .populate({
            path: "brand_id",
            select: "_id name",
          })
          .sort("-_id")
          .limit(8)
          .exec(),
        Product.find({ type: "rent" })
          .select("_id name price stock image type original")
          .populate({
            path: "brand_id",
            select: "_id name",
          })
          .sort("-_id")
          .limit(8)
          .exec(),
        Banner.find().sort("-_id").exec(),
        Category.aggregate([
          {
            $match: {
              parent_id: null,
            },
          },
        ]).then((categories) => {
          const cate_id = [];
          categories.map((cate) => {
            cate_id.push(cate._id);
          });
          return Category.aggregate([
            {
              $match: {
                parent_id: { $in: cate_id },
                image: { $ne: "" },
              },
            },
            {
              $limit: 12,
            },
          ]);
        }),
      ]);
    setRedisCache(req, redisKey, {
      product,
      banner,
      categories,
      brand,
      rentProduct,
      saleProduct,
    });
    res.json({
      product,
      banner,
      categories,
      brand,
      rentProduct,
      saleProduct,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/category", async (req, res) => {
  try {
    const redisKey = "CATEGORIES";
    let category = await getFromRedisCache(req, redisKey);
    if (category) return res.json(category);
    category = await Category.find({ parent_id: null });
    setRedisCache(req, redisKey, category, 86400);
    res.json(category);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Products detail
router.get("/product-detail/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand_id")
      .populate("category_id")
      .populate("size_id")
      .populate("color_id")
      .populate("seller_id");
    const related = await Product.find({
      category_id: product.category_id,
      _id: { $ne: product._id },
    })
      .populate("brand_id")
      .limit(12);
    res.json({ product, related });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});

router.get("/productall", auth, async (req, res) => {
  try {
    const product = await Product.find({ seller_id: req.user._id })
      .populate("brand_id")
      .populate("category_id")
      .populate("size_id")
      .populate("color_id")
      .populate("user_id")
      .sort("-_id");
    res.json(product);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// closet
router.post("/closet/:id", async (req, res) => {
  try {
    var perPage = 24;
    var pageNo = 0;
    var sorting = "-_id";
    if (req.body.pageno) {
      pageNo = req.body.pageno - 1;
    }
    if (req.body.sorting) {
      sorting = req.body.sorting;
    }

    const product_query = Product.find({ seller_id: req.params.id })
      .populate({
        path: "brand_id",
        select: "name",
      })
      .populate({
        path: "category_id",
        select: "name",
      })
      .populate({
        path: "size_id",
        select: "name",
      })
      .populate({
        path: "color_id",
        select: "name",
      })
      .populate({
        path: "seller_id",
        select: "-interests -password -verifyKey",
      })
      .populate({
        path: "likes",
        select: "user_id",
      })
      .limit(perPage)
      .skip(perPage * pageNo)
      .sort(sorting);
    if (!req.body.productOnly) {
      const [product, total, user] = await Promise.all([
        product_query.exec(),
        Product.countDocuments({ seller_id: req.params.id }).exec(),
        User.findById(req.params.id)
          .select("-email -password -balance -phone")
          .exec(),
      ]);
      const { pickup, ...userInfo } = user._doc;
      res.json({ product, user: userInfo, total });
    } else {
      var product = await product_query.exec();
      res.json(product);
    }
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});

// city district

router.get("/city", async (req, res) => {
  try {
    const city = await City.find();
    const district = await District.find();
    res.json({ city, district });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});

// create-post
router.get("/createpost", auth, async (req, res) => {
  try {
    const sizes = await Size.find();
    const categories = await Category.find({ parent_id: null });
    const colors = await Color.find();
    const brands = await Brand.find();
    const pickupCharge = process.env.PICKUP_CHARGE || 15;
    const commission = process.env.COMMISSION || 2;
    res.json({ sizes, categories, colors, brands, pickupCharge, commission });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});

// search

router.post("/search-request", async (req, res) => {
  var schema = Joi.object({
    search: Joi.string().required(),
    pageNo: Joi.number().allow(null, ""),
    sorting: Joi.string().allow(null, ""),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json(error.message);
  }

  try {
    var perPage = 24;
    var pageNo = 0;
    var sorting = "-_id";
    if (req.body.pageNo) {
      pageNo = req.body.pageNo - 1;
    }
    if (req.body.sorting) {
      sorting = req.body.sorting;
    }

    var search = req.body.search.split(" ");

    const regex = search.map((value) => new RegExp(value, "i"));

    const product = await Product.find({
      name: { $in: regex },
    })
      .populate({
        path: "brand_id",
        select: "name",
      })
      .populate({
        path: "category_id",
        select: "name",
      })
      .populate({
        path: "size_id",
        select: "name",
      })
      .populate({
        path: "color_id",
        select: "name",
      })
      .populate({
        path: "seller_id",
        select: "-interests -password -verifyKey",
      })
      .populate({
        path: "likes",
        select: "user_id",
      })
      .limit(perPage)
      .skip(perPage * pageNo)
      .sort(sorting);

    res.json(product);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/search-sidebar", async (req, res) => {
  try {
    const [color, brand, category] = await Promise.all([
      Color.find().exec(),
      Brand.find().exec(),
      Category.find({ parent_id: null }).exec(),
    ]);
    res.json({ color, brand, category });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

async function getSearchResult(arr, category_id, body, min, max) {
  var searchArray = body.search.split(" ");
  var perPage = 24;
  var pageNo = 0;
  var sorting = "-_id";
  if (body.pageNo) {
    pageNo = body.pageNo - 1;
  }
  if (body.sorting) {
    sorting = body.sorting;
  }
  const regex = searchArray.map((value) => new RegExp(value, "i"));

  switch (true) {
    case category_id != null &&
      body.color_id &&
      body.color_id.length != 0 &&
      body.brand_id &&
      body.brand_id.length != 0 &&
      max != null:
      var products = await Product.find({
        name: { $in: regex },
        category_id: { $in: category_id },
        color_id: { $in: body.color_id },
        brand_id: { $in: body.brand_id },
        price: { $gte: min, $lte: max },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    case body.color_id &&
      body.color_id.length != 0 &&
      body.brand_id &&
      body.brand_id.length != 0 &&
      max != null:
      var products = await Product.find({
        name: { $in: regex },
        color_id: { $in: body.color_id },
        brand_id: { $in: body.brand_id },
        price: { $gte: min, $lte: max },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    case category_id != null &&
      body.brand_id &&
      body.brand_id.length != 0 &&
      max != null:
      var products = await Product.find({
        name: { $in: regex },
        brand_id: { $in: body.brand_id },
        category_id: { $in: category_id },
        price: { $gte: min, $lte: max },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    case category_id != null &&
      body.color_id &&
      body.color_id.length != 0 &&
      max != null:
      var products = await Product.find({
        name: { $in: regex },
        category_id: { $in: category_id },
        color_id: { $in: body.color_id },
        price: { $gte: min, $lte: max },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    case category_id != null &&
      body.color_id &&
      body.color_id.length != 0 &&
      body.brand_id &&
      body.brand_id.length != 0:
      var products = await Product.find({
        name: { $in: regex },
        category_id: { $in: category_id },
        color_id: { $in: body.color_id },
        brand_id: { $in: body.brand_id },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;

    case body.color_id && body.color_id.length != 0 && max != null:
      var products = await Product.find({
        name: { $in: regex },
        color_id: { $in: body.color_id },
        price: { $gte: min, $lte: max },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    case body.brand_id && body.brand_id.length != 0 && max != null:
      var products = await Product.find({
        name: { $in: regex },
        brand_id: { $in: body.brand_id },
        price: { $gte: min, $lte: max },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    case body.color_id &&
      body.color_id.length != 0 &&
      body.brand_id &&
      body.brand_id.length != 0:
      var products = await Product.find({
        name: { $in: regex },
        color_id: { $in: body.color_id },
        brand_id: { $in: body.brand_id },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    case category_id != null && body.brand_id && body.brand_id.length != 0:
      var products = await Product.find({
        name: { $in: regex },
        category_id: { $in: category_id },
        brand_id: { $in: body.brand_id },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    case category_id != null && body.color_id && body.color_id.length != 0:
      var products = await Product.find({
        name: { $in: regex },
        category_id: { $in: category_id },
        color_id: { $in: body.color_id },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    case category_id != null && max != null:
      var products = await Product.find({
        name: { $in: regex },
        category_id: { $in: category_id },
        price: { $gte: min, $lte: max },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    case category_id != null:
      var products = await Product.find({
        name: { $in: regex },
        category_id: { $in: category_id },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    case body.color_id && body.color_id.length != 0:
      var products = await Product.find({
        name: { $in: regex },
        color_id: { $in: body.color_id },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    case body.brand_id && body.brand_id.length != 0:
      var products = await Product.find({
        name: { $in: regex },
        brand_id: { $in: body.brand_id },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    case max != null:
      var products = await Product.find({
        name: { $in: regex },
        price: { $gte: min, $lte: max },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
    default:
      console.log("default");
      var products = await Product.find({
        name: { $in: regex },
      })
        .populate({
          path: "brand_id",
          select: "name",
        })
        .populate({
          path: "category_id",
          select: "name",
        })
        .populate({
          path: "size_id",
          select: "name",
        })
        .populate({
          path: "color_id",
          select: "name",
        })
        .populate({
          path: "seller_id",
          select: "-interests -password -verifyKey",
        })
        .populate({
          path: "likes",
          select: "user_id",
        })
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort(sorting);
      break;
  }

  if (products && products.length != 0) {
    products.map((product) => {
      var a = arr.some((ar) => ar._id == product._id);
      if (a) {
      } else {
        arr.push(product);
      }
    });
  }
  // if (category_id) {
  //   const childs = await Category.find({ parent_id: category_id });
  //   var categories = childs.map(async (child) => {
  //     return await getSearchResult(arr, child._id, body, min, max, query);
  //   });
  //   await Promise.all(categories);
  // }

  return arr;
}

router.post("/search-filter", async (req, res) => {
  try {
    if (req.body.minprice && req.body.maxprice != 0) {
      var min = Math.min(...req.body.minprice);
      var max = Math.max(...req.body.maxprice);
    } else {
      var min = null;
      var max = null;
    }

    var searchResult = [];
    var cat_ids = null;
    function childrens(categories) {
      categories.map((category) => {
        cat_ids.push(category._id);
        if (category.childrens.length) {
          childrens(category.childrens);
        }
      });
    }
    if (req.body?.category_id?.length) {
      cat_ids = req.body.category_id;
      var categoryList = req.body.category_id.map(async (category) => {
        var categories = await Category.find({ parent_id: category });
        childrens(categories);
      });
      await Promise.all(categoryList);
    }

    var products = await getSearchResult([], cat_ids, req.body, min, max);
    res.send(products);
  } catch (error) {
    ApiError(res, 500, error.message, error);
  }
});

router.post("/notification/token", auth, async (req, res) => {
  try {
    const config = await ExpoToken.findOne({
      token: req.body.token,
      user_id: req.user._id,
    });
    if (config) {
      return res.send("OK");
    }
    var expoToken = new ExpoToken({
      user_id: req.user._id,
      token: req.body.token,
    });
    expoToken = await expoToken.save();
    res.json("ok");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/interests/feed", auth, async (req, res) => {
  try {
    //2nd layer
    var interests_arr = [];
    for (const category of req.body.interests) {
      const childs = await Category.find({ parent_id: category });

      for (const child of childs) {
        interests_arr.push(child._id);
      }
      interests_arr.push(category);
    }

    const interests = await User.findByIdAndUpdate(
      req.user._id,
      {
        interests: interests_arr,
      },
      { new: true }
    );
    res.send(interests);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/dashboard/stats", async (req, res) => {
  try {
    const [products, customers, orders] = await Promise.all([
      Product.countDocuments().exec(),
      User.countDocuments().exec(),
      Order.countDocuments().exec(),
    ]);

    const sales = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$total",
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    res.send({
      products,
      customers,
      orders,
      sales: sales.length ? sales[0].total : 0,
    });
  } catch (error) {
    ApiError(res, 500, error.message, error);
  }
});

module.exports = router;
