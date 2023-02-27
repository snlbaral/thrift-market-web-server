const express = require("express");
const router = express.Router();
const Brand = require("../Models/Brand");
const Product = require("../Models/Product");
const Color = require("../Models/Color");
const auth = require("../Middleware/auth");
const adminAuth = require("../Middleware/adminAuth");
const ApiError = require("../Middleware/ApiError");
const Joi = require("joi");
const { fileUploadFormData, removeFile } = require("../Middleware/helpers");

router.get("/", async (req, res) => {
  try {
    const brand = await Brand.find().sort("-_id");
    res.json(brand);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/", adminAuth, async (req, res) => {
  try {
    var schema = Joi.object({
      name: Joi.string().required(),
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

    var slug = req.body.name.replace(" ", "-").toLowerCase();
    var brand = new Brand({
      name: req.body.name,
      slug: slug,
      image: data,
    });

    brand = await brand.save();
    res.json(brand);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    res.json(brand);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.put("/:id", adminAuth, async (req, res) => {
  try {
    var schema = Joi.object({
      name: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return ApiError(res, 400, error.message);
    }

    if (req.files) {
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
    var slug = req.body.name.replace(" ", "-").toLowerCase();
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        slug: slug,
        image: picture,
      },
      { new: true }
    );
    res.json(brand);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/filter", async (req, res) => {
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
    const brand = await Brand.findOne({ slug: req.body.slug });
    const products = await Product.find({ brand_id: brand._id })
      .limit(perPage)
      .skip(perPage * pageNo)
      .sort(sorting);
    const colors = await Color.find();
    const brands = await Brand.find().sort("-productcount");
    const total = await Product.countDocuments({ brand_id: brand._id });
    res.json({ products, colors, brands, brand, total });
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

async function getProductFilter(arr, body, min, max) {
  var perPage = 24;
  var pageno = 0;
  var sorting = "-_id";
  if (body.pageno) {
    pageno = body.pageno - 1;
  }
  if (body.sorting) {
    sorting = body.sorting;
  }
  switch (true) {
    case body.color_id && body.color_id.length > 0 && max != null:
      var products = await Product.find({
        brand_id: { $in: body.brand_id },
        color_id: { $in: body.color_id },
        price: { $gte: min, $lte: max },
      })
        .limit(perPage)
        .skip(perPage * pageno)
        .sort(sorting);
      var total = await Product.countDocuments({
        brand_id: { $in: body.brand_id },
        color_id: { $in: body.color_id },
        price: { $gte: min, $lte: max },
      });
      break;
    case body.color_id && body.color_id.length > 0:
      var products = await Product.find({
        brand_id: { $in: body.brand_id },
        color_id: { $in: body.color_id },
      })
        .limit(perPage)
        .skip(perPage * pageno)
        .sort(sorting);

      var total = await Product.countDocuments({
        brand_id: { $in: body.brand_id },
        color_id: { $in: body.color_id },
      });
      break;
    case max != null:
      var products = await Product.find({
        brand_id: { $in: body.brand_id },
        price: { $gte: min, $lte: max },
      })
        .limit(perPage)
        .skip(perPage * pageno)
        .sort(sorting);

      var total = await Product.countDocuments({
        brand_id: { $in: body.brand_id },
        price: { $gte: min, $lte: max },
      });

      break;

    default:
      var products = await Product.find({ brand_id: { $in: body.brand_id } })
        .limit(perPage)
        .skip(perPage * pageno)
        .sort(sorting);
      var total = await Product.countDocuments({
        brand_id: { $in: body.brand_id },
      });

      break;
  }

  if (products && products.length != 0) {
    products.map((product) => {
      arr.push(product);
    });
  }
  return {
    total,
    products: arr,
  };
}

router.post("/brandcheck", async (req, res) => {
  try {
    if (req.body.brand_id && req.body.brand_id != 0) {
      var arr = [];
      if (req.body.minprice && req.body.maxprice != 0) {
        var min = Math.min(...req.body.minprice);
        var max = Math.max(...req.body.maxprice);
      } else {
        var min = null;
        var max = null;
      }

      const { products, total } = await getProductFilter(
        arr,
        req.body,
        min,
        max
      );

      res.json({ products, total });
    } else {
      ApiError(res, 400, "Invalid Params");
    }
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const brand = await Brand.findByIdAndRemove(req.params.id);
    removeFile(brand.image);
    res.json(brand);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

module.exports = router;
