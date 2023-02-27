const express = require("express");
const router = express.Router();
const Category = require("../Models/Category");
const Product = require("../Models/Product");
const Color = require("../Models/Color");
const Brand = require("../Models/Brand");
const auth = require("../Middleware/auth");
const adminAuth = require("../Middleware/adminAuth");
const ApiError = require("../Middleware/ApiError");

router.get("/", async (req, res) => {
  try {
    const category = await Category.find({ parent_id: null });
    res.json(category);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.get("/all", async (req, res) => {
  try {
    const category = await Category.find();
    res.json(category);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.post("/", adminAuth, async (req, res) => {
  try {
    if (req.files) {
      const image = req.files.image;
      var imageName = new Date().getTime() + "." + image.name.split(".").pop();
      var picture = "/images/" + imageName;

      const uploadPath = process.env.IMAGE_UPLOAD_PATH + imageName;

      image.mv(uploadPath, (error) => {
        if (error) {
          return ApiError(res, 500, error.message);
        }
      });

      if (req.files.cover) {
        const cover = req.files.cover;
        var coverName =
          new Date().getTime() + "." + cover.name.split(".").pop();
        var catCover = "/images/" + coverName;

        const coverUploadPath = process.env.IMAGE_UPLOAD_PATH + coverName;
        cover.mv(coverUploadPath, (error) => {});
      } else {
        var catCover = "";
      }
    } else {
      var picture = "";
    }

    var parent_id = await Category.findById(req.body.parent_id);
    var slug =
      parent_id.slug + "-" + req.body.name.replace(" ", "-").toLowerCase();

    if (req.body.parent_id) {
      var category = new Category({
        name: req.body.name,
        image: picture,
        slug: slug,
        parent_id: req.body.parent_id,
        cover: catCover,
      });
    } else {
      var category = new Category({
        name: req.body.name,
        slug: slug,
        image: picture,
        cover: catCover,
      });
    }
    const parent = await Category.findByIdAndUpdate(req.body.parent_id, {
      $push: {
        child_id: category._id,
      },
    });

    category = await category.save();
    res.json(category);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json(category);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.put("/:id", adminAuth, async (req, res) => {
  try {
    if (req.files) {
      const image = req.files.image;
      var imageName = new Date().getTime() + "." + image.name.split(".").pop();
      var picture = "/images/" + imageName;

      const uploadPath = process.env.IMAGE_UPLOAD_PATH + imageName;

      image.mv(uploadPath, (error) => {
        if (error) {
          return ApiError(res, 400, error.message);
        }
      });

      if (req.files.cover) {
        const cover = req.files.cover;
        var coverName =
          new Date().getTime() + "." + cover.name.split(".").pop();
        var catCover = "/images/" + coverName;

        const coverUploadPath = process.env.IMAGE_UPLOAD_PATH + coverName;
        cover.mv(coverUploadPath, (error) => {});
      } else {
        var catCover = "";
      }
    } else {
      var picture = "";
    }

    var slug = req.body.name.replace(" ", "-").toLowerCase();
    if (req.body.parent_id) {
      var parent = req.body.parent_id;
      var parent_category = await Category.findById(req.body.parent_id);
      slug =
        parent_category.slug +
        "-" +
        req.body.name.replace(" ", "-").toLowerCase();
    } else var parent = null;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        slug: slug,
        image: picture,
        parent_id: parent,
        cover: catCover,
      },
      { new: true }
    );

    res.json(category);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

async function child(id, arr) {
  try {
    const categories = await Category.find({ parent_id: id });

    function childrens(categories) {
      categories.map((category) => {
        arr.push(category._id);
        if (category.childrens.length) {
          childrens(category.childrens);
        }
      });
    }
    childrens(categories);
    return arr;
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
}

router.post("/filter", async (req, res) => {
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

    const category = await Category.aggregate([
      {
        $match: {
          slug: req.body.category_slug,
        },
      },
    ]);

    const [brands, colors, categories] = await Promise.all([
      Brand.find().select("_id name productcount").exec(),
      Color.find().select("_id name productcount").exec(),
      Category.find({ parent_id: category[0]._id })
        .select("_id name productcount")
        .sort("-productcount")
        .exec(),
    ]);

    var arr = [];
    arr.push(category[0]._id);

    function children(categories) {
      categories.forEach((category) => {
        arr.push(category._id);
        if (category?.childrens.length) {
          children(category.childrens);
        }
      });
    }
    children(categories);

    const [products, count] = await Promise.all([
      Product.find({ category_id: { $in: arr } })
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
        .sort(sorting)

        .exec(),
      Product.countDocuments({ category_id: { $in: arr } }).exec(),
    ]);

    res.json({ category, categories, products, brands, colors, count });
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

async function getProductsFilters(cateIds, arr, body, min, max) {
  var perPage = 24;
  var pageNo = 0;
  var sorting = "-_id";
  if (body.pageNo) {
    pageNo = body.pageNo - 1;
  }
  if (body.sorting) {
    sorting = body.sorting;
  }

  switch (true) {
    //if color, brand, price exists
    case body.color_id &&
      body.color_id.length > 0 &&
      body.brand_id &&
      body.brand_id.length > 0 &&
      max != null:
      var [products, total] = await Promise.all([
        Product.find({
          category_id: { $in: cateIds },
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
          .sort(sorting)
          .exec(),
        Product.countDocuments({
          category_id: { $in: cateIds },
          color_id: { $in: body.color_id },
          brand_id: { $in: body.brand_id },
          price: { $gte: min, $lte: max },
        }).exec(),
      ]);

      break;
    //if color and price exits
    case body.color_id && body.color_id.length > 0 && max != null:
      var [products, total] = await Promise.all([
        Product.find({
          category_id: { $in: cateIds },
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
          .sort(sorting)
          .exec(),

        Product.countDocuments({
          category_id: { $in: cateIds },
          color_id: { $in: body.color_id },
          price: { $gte: min, $lte: max },
        }),
      ]);
      break;
    //if brand and price exist
    case body.brand_id && body.brand_id.length > 0 && max != null:
      var [products, total] = await Promise.all([
        Product.find({
          category_id: { $in: cateIds },
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
          .sort(sorting)
          .exec(),
        Product.countDocuments({
          category_id: { $in: cateIds },
          brand_id: { $in: body.brand_id },
          price: { $gte: min, $lte: max },
        }).exec(),
      ]);
      break;
    //if color and brand exist
    case body.color_id &&
      body.color_id.length > 0 &&
      body.brand_id &&
      body.brand_id.length > 0:
      var [products, total] = await Promise.all([
        Product.find({
          category_id: { $in: cateIds },
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
          .sort(sorting)
          .exec(),
        Product.countDocuments({
          category_id: { $in: cateIds },
          color_id: { $in: body.color_id },
          brand_id: { $in: body.brand_id },
        }).exec(),
      ]);
      break;
    //if color exists
    case body.color_id && body.color_id.length > 0:
      var [products, total] = await Promise.all([
        Product.find({
          category_id: { $in: cateIds },
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
          .sort(sorting)
          .exec(),
        Product.countDocuments({
          category_id: { $in: cateIds },
          color_id: { $in: body.color_id },
        }).exec(),
      ]);
      break;
    //if brand exists
    case body.brand_id && body.brand_id.length > 0:
      var [products, total] = await Promise.all([
        Product.find({
          category_id: { $in: cateIds },
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
          .sort(sorting)
          .exec(),
        Product.countDocuments({
          category_id: { $in: cateIds },
          brand_id: { $in: body.brand_id },
        }).exec(),
      ]);

      break;
    //if price exists
    case min != null:
      var [products, total] = await Promise.all([
        Product.find({
          category_id: { $in: cateIds },
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
          .sort(sorting)
          .exec(),
        Product.countDocuments({
          category_id: { $in: cateIds },
          price: { $gte: min, $lte: max },
        }).exec(),
      ]);

      break;
    //default
    default:
      var [products, total] = await Promise.all([
        Product.find({ category_id: { $in: cateIds } })

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
          .sort(sorting)
          .exec(),
        Product.countDocuments({
          category_id: { $in: cateIds },
        }).exec(),
      ]);

      break;
  }
  return {
    products,
    total,
  };
}

router.post("/checkfilter", async (req, res) => {
  try {
    if (req.body.category_id && req.body.category_id.length != 0) {
      var arr = [];

      if (req.body.minprice && req.body.maxprice != 0) {
        var min = Math.min(...req.body.minprice);
        var max = Math.max(...req.body.maxprice);
      } else {
        var min = null;
        var max = null;
      }
      var categories = [];

      var xyz = req.body.category_id.map(async (cat) => {
        var tempcategories = await child(cat, []);
        categories = [...tempcategories, ...categories];
      });

      await Promise.all(xyz);
      categories = [...categories, ...req.body.category_id];
      const { products, total } = await getProductsFilters(
        categories,
        [],
        req.body,
        min,
        max
      );
      res.json({ total, products });
    } else {
      ApiError(res, 400, "Invalid Params");
    }
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    res.json(category);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

module.exports = router;
