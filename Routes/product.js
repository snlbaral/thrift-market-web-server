const express = require("express");
const Product = require("../Models/Product");
const Category = require("../Models/Category");
const Banner = require("../Models/Banner");
const Brand = require("../Models/Brand");
const router = express.Router();
const auth = require("../Middleware/auth");
const adminAuth = require("../Middleware/adminAuth");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const ApiError = require("../Middleware/ApiError");

//Admin Panel
router.get("/", adminAuth, async (req, res) => {
  try {
    const product = await Product.find()
      .populate("brand_id")
      .populate("category_id")
      .populate("size_id")
      .populate("color_id")
      .populate("user_id")
      .sort("-_id");
    res.json(product);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

function imageUpload(image) {
  var imageName = uuidv4() + ".png";
  var picture = "/images/" + imageName;
  const uploadPath = process.env.IMAGE_UPLOAD_PATH + imageName;
  var imgBase64 = image;
  var base64Data = imgBase64.replace("data:image/png;base64, ", "");
  fs.writeFile(uploadPath, base64Data, "base64", function (err) {
    console.log(err);
  });
  return picture;
}

// create post for app
router.post("/create/post", auth, async (req, res) => {
  var schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    detail: Joi.string().required(),
    size: Joi.string().required(),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    color: Joi.string().required(),
    type: Joi.string().required(),
    original: Joi.number().required(),
    earning_price: Joi.number().required().positive(),
    image1: Joi.string().allow(null, ""),
    image2: Joi.string().allow(null, ""),
    image3: Joi.string().allow(null, ""),
    image4: Joi.string().allow(null, ""),
    custombrand: Joi.string().allow(null, ""),
    pickupOption: Joi.string().allow(null, ""),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }

  try {
    var feature_image = [];
    var picture = imageUpload(req.body.image1);
    if (req.body.image2) {
      var feature1 = imageUpload(req.body.image2);
      feature_image.push(feature1);
    }
    if (req.body.image3) {
      var feature2 = imageUpload(req.body.image3);
      feature_image.push(feature2);
    }
    if (req.body.image4) {
      var feature3 = imageUpload(req.body.image4);
      feature_image.push(feature3);
    }
    var brand_id = req.body.brand;
    if (req.body.custombrand && req.body.custombrand != "false") {
      var duplicate = await Brand.findOne({ name: req.body.brand });
      if (duplicate) {
        brand_id = duplicate._id;
      } else {
        var brand = new Brand({
          name: req.body.brand,
          slug: req.body.brand.replace(" ", "-"),
          productcount: 1,
        });
        await brand.save();
        brand_id = brand._id;
      }
    } else {
      var duplicate = await Brand.findById(req.body.brand);
    }
    var product = new Product({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      detail: req.body.detail,
      discount: req.body.discount,
      sku: req.body.sku,
      size_id: req.body.size,
      brand_id: brand_id,
      category_id: req.body.category,
      color_id: req.body.color,
      image: picture,
      seller_id: req.user._id,
      feature_image: feature_image,
      type: req.body.type,
      original: req.body.original,
      pickupOption: req.body.pickupOption,
      earning: req.body.earning_price,
    });
    product = await product.save();
    if (duplicate) {
      duplicate.productcount = duplicate.productcount + 1;
      await duplicate.save();
    }

    async function productcount(category_id) {
      var cate = await Category.findById(category_id);
      cate.productcount = cate.productcount + 1;
      await cate.save();
      if (cate.parent_id) {
        productcount(cate.parent_id);
      }
    }
    productcount(req.body.category);
    res.json(product);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

// edit post for app
router.put("/edit/post/:id", auth, async (req, res) => {
  var schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    detail: Joi.string().required(),
    size: Joi.string().required(),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    color: Joi.string().required(),
    type: Joi.string().required(),
    original: Joi.number().required(),
    earning_price: Joi.number().required().positive(),
    image1: Joi.string().allow(null, ""),
    image2: Joi.string().allow(null, ""),
    image3: Joi.string().allow(null, ""),
    image4: Joi.string().allow(null, ""),
    custombrand: Joi.string().allow(null, ""),
    pickupOption: Joi.string().allow(null, ""),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }

  try {
    var product = await Product.findById(req.params.id);
    if (!product) ApiError(res, 500, "Product not found.");

    if (req.body.image1) {
      var picture = imageUpload(req.body.image1);
      product.image = picture;
    }
    if (req.body.image2) {
      var feature1 = imageUpload(req.body.image2);
      product.feature_image[0] = feature1;
    }
    if (req.body.image3) {
      var feature2 = imageUpload(req.body.image3);
      product.feature_image[1] = feature2;
    }
    if (req.body.image4) {
      var feature3 = imageUpload(req.body.image4);
      product.feature_image[2] = feature3;
    }

    var brand_id = req.body.brand;
    if (req.body.custombrand && req.body.custombrand != "false") {
      var duplicate = await Brand.findOne({ name: req.body.brand });
      if (duplicate) {
        brand_id = duplicate._id;
      } else {
        var brand = new Brand({
          name: req.body.brand,
          slug: req.body.brand.replace(" ", "-"),
          productcount: 1,
        });
        await brand.save();
        brand_id = brand._id;
      }
    }
    product.brand_id = brand_id;
    product.name = req.body.name;
    product.stock = req.body.stock;
    product.price = req.body.price;
    product.detail = req.body.detail;
    product.discount = req.body.discount;
    product.category_id = req.body.category;
    product.size_id = req.body.size;
    product.color_id = req.body.color;
    product.type = req.body.type;
    product.original = req.body.original;
    product.earning = req.body.earning_price;
    product.pickupOption = req.body.pickupOption;
    await product.save();
    product = await product
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
      .execPopulate();
    res.json(product);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

// cretae post for web
router.post("/", auth, async (req, res) => {
  var schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.string().required(),
    stock: Joi.string().required(),
    detail: Joi.string().required(),
    size: Joi.string().required(),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    color: Joi.string().required(),
    type: Joi.string().required(),
    original: Joi.string().required(),
    custombrand: Joi.string().allow(null, ""),
    sku: Joi.string().allow(null, ""),
    earning: Joi.number().required().positive(),
    pickupOption: Joi.string().allow(null, ""),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }

  try {
    if (req.files) {
      if (req.files.image) {
        const image = req.files.image;

        var imageName =
          new Date().getTime() + "." + image.name.split(".").pop();

        var picture = "/images/" + imageName;
        const uploadPath = process.env.IMAGE_UPLOAD_PATH + imageName;
        image.mv(uploadPath, (error) => {
          if (error) {
            return res.status(500).json(error.message);
          }
        });
      }
      //Feature Image
      if (req.files.feature && req.files.feature.length != 0) {
        var feature_image = [];
        if (!Array.isArray(req.files.feature)) {
          req.files.feature = [req.files.feature];
        }
        req.files.feature.map((feature) => {
          //File Rename
          var r = Math.random();
          r = r.toString().replace(".", "-");
          var imagesName =
            new Date().getTime() + r + "." + feature.name.split(".").pop();
          //Database
          var picture = "/images/" + imagesName;
          feature_image.push(picture);

          const uploadPath = process.env.IMAGE_UPLOAD_PATH + imagesName;
          feature.mv(uploadPath, (error) => {
            if (error) {
              return res.status(500).json(error.message);
            }
          });
        });
      } else {
        var feature_image = [];
      }
    } else {
      var picture = "";
    }

    var brand_id = req.body.brand;
    if (req.body.custombrand && req.body.custombrand != "false") {
      var duplicate = await Brand.findOne({ name: req.body.brand });
      if (duplicate) {
        brand_id = duplicate._id;
      } else {
        var brand = new Brand({
          name: req.body.brand,
          slug: req.body.brand.replace(" ", "-"),
          productcount: 1,
        });
        await brand.save();
        brand_id = brand._id;
      }
    } else {
      var duplicate = await Brand.findById(req.body.brand);
    }

    var product = new Product({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      detail: req.body.detail,
      sku: req.body.sku,
      size_id: req.body.size,
      brand_id: brand_id,
      category_id: req.body.category,
      color_id: req.body.color,
      image: picture,
      seller_id: req.user._id,
      feature_image: feature_image,
      type: req.body.type,
      original: req.body.original,
      earning: req.body.earning,
      pickupOption: req.body.pickupOption,
    });

    product = await product.save();
    if (duplicate) {
      duplicate.productcount = duplicate.productcount + 1;
      await duplicate.save();
    }
    async function productcount(category_id) {
      var cate = await Category.findById(category_id);
      cate.productcount = cate.productcount + 1;
      await cate.save();
      if (cate.parent_id) {
        productcount(cate.parent_id);
      }
    }
    productcount(req.body.category);
    res.json(product);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand_id")
      .populate("category_id")
      .populate("size_id")
      .populate("color_id");
    res.json(product);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// Update Product Web
router.put("/:id", auth, async (req, res) => {
  var schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.string().required(),
    stock: Joi.string().required(),
    detail: Joi.string().required(),
    size: Joi.string().required(),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    color: Joi.string().required(),
    type: Joi.string().required(),
    original: Joi.string().required(),
    custombrand: Joi.string().allow(null, ""),
    earning: Joi.number().required().positive(),
    pickupOption: Joi.string().allow(null, ""),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }
  try {
    const product = await Product.findById(req.params.id);
    if (req.files) {
      if (req.files.image) {
        //Image
        const image = req.files.image;

        var r = Math.random();
        r = r.toString().replace(".", "-");
        var imageName =
          new Date().getTime() + r + "." + image.name.split(".").pop();

        var picture = "/images/" + imageName;
        product.image = picture;
        const uploadPath = process.env.IMAGE_UPLOAD_PATH + imageName;

        //File Upload
        image.mv(uploadPath, (error) => {
          if (error) {
            return ApiError(res, 400, "Server Error", error);
          }
        });
      }
      //Feature Image
      if (req.files.feature && req.files.feature.length != 0) {
        var feature_image = [];
        var feature_error = false;
        req.files.feature.map((feature) => {
          //File Rename
          var imagesName =
            new Date().getTime() + "." + feature.name.split(".").pop();
          //Database
          var picture = "/images/" + imagesName;
          feature_image.push(picture);

          //Upload
          const uploadPath = process.env.IMAGE_UPLOAD_PATH + imagesName;
          console.log(uploadPath);
          feature.mv(uploadPath, (error) => {
            if (error) {
              feature_error = error.message;
              return ApiError(res, 400, "Server Error", error);
            }
          });
        });

        if (feature_error) {
          return ApiError(res, 400, feature_error || "Server Error");
        }

        product.feature_image = feature_image;
      }
    }

    var brand_id = req.body.brand;

    if (req.body.custombrand && req.body.custombrand != "false") {
      var brand = new Brand({
        name: req.body.brand,
        slug: req.body.brand.replace(" ", "-"),
      });
      await brand.save();
      brand_id = brand._id;
    }

    product.name = req.body.name;
    product.price = req.body.price;
    product.stock = req.body.stock;
    product.detail = req.body.detail;
    product.discount = req.body.discount;
    product.sku = req.body.sku;
    product.category_id = req.body.category;
    product.brand_id = brand_id;
    product.size_id = req.body.size;
    product.color_id = req.body.color;
    product.type = req.body.type;
    product.original = req.body.original;
    product.earning = req.body.earning;
    product.pickupOption = req.body.pickupOption;

    await product.save();
    res.json(product);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });
    res.json(product);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

module.exports = router;
