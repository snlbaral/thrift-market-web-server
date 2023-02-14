const express = require("express");
const router = express.Router();
const Order = require("../Models/Order");
const auth = require("../Middleware/auth");
const Addtocart = require("../Models/Addtocart");
const Product = require("../Models/Product");
const User = require("../Models/User");
const Transaction = require("../Models/Transaction");
const Joi = require("joi");
const axios = require("axios").default;
var FormData = require("form-data");
const OrderNotification = require("../Models/OrderNotification");
const mongoose = require("mongoose");
const Address = require("../Models/Address");
const OrderAddress = require("../Models/OrderAddress");
const ApiError = require("../Middleware/ApiError");
const { sendExpoToken } = require("../Middleware/helpers");
const OrderTracker = require("../Models/OrderTracker");
const easyinvoice = require("easyinvoice");
const fs = require("fs");
const FundClearance = require("../Models/FundClearance");
const PickupLocation = require("../Models/PickupLocation");
const QRCode = require("qrcode");
const JsBarcode = require("jsbarcode");
const { createCanvas } = require("@napi-rs/canvas");
const ejs = require("ejs");
const pdf = require("html-pdf");
const moment = require("moment");

async function transaction(cartitems, body, user_id) {
  try {
    var shipping = await Address.findById(body.shipping_id);
    var billing = await Address.findById(body.billing_id);

    if (!shipping) {
      return { status: 500, error: "Server Error" };
    }
    if (!billing) {
      return { status: 500, error: "Server Error" };
    }

    var seller = [];
    cartitems.map((item) => {
      seller.push(item.seller_id);
    });

    var transaction = new Transaction({
      user_id: user_id,
      total: body.total,
      shipping: body.shipping,
      transaction_id: body.transaction_id,
      payment_method: body.payment_method,
      seller_id: seller,
    });
    transaction = await transaction.save();

    var shipping_order_address = new OrderAddress({
      phone: shipping.phone,
      district: shipping.district,
      city: shipping.city,
      street: shipping.street,
      municipality: shipping.municipality,
      zipcode: shipping.zipcode,
      name: shipping.name,
      user_id: user_id,
      type: "shipping",
      transaction_id: transaction._id,
    });

    var billing_order_address = new OrderAddress({
      phone: billing.phone,
      district: billing.district,
      city: billing.city,
      street: billing.street,
      municipality: billing.municipality,
      zipcode: billing.zipcode,
      name: billing.name,
      user_id: user_id,
      type: "billing",
      transaction_id: transaction._id,
    });
    await shipping_order_address.save();
    await billing_order_address.save();
    return { status: 200, transaction };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

router.get("/transaction", auth, async (req, res) => {
  try {
    const transaction = await Transaction.find({ user_id: req.user._id })
      .populate("orders")
      .populate("addresses")
      .populate("user_id")
      .sort("-_id");
    res.json(transaction);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/transaction/pagination", auth, async (req, res) => {
  try {
    var perPage = 10;
    var pageNo = 0;
    if (req.body.pageno) {
      pageNo = req.body.pageno - 1;
    }
    if (req.body.itemsPerPage) {
      perPage = req.body.itemsPerPage;
    }

    const [transactions, total] = await Promise.all([
      Transaction.find({ user_id: req.user._id })
        .populate("orders")
        .populate("addresses")
        .populate("user_id")
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort("-_id")
        .exec(),
      Transaction.countDocuments({ user_id: req.user._id }).exec(),
    ]);
    res.json({ transactions, total });
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/transaction/app", auth, async (req, res) => {
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

    const transaction = await Transaction.find({ user_id: req.user._id })
      .populate("orders")
      .populate("addresses")
      .populate("user_id")
      .limit(perPage)
      .skip(perPage * pageNo)
      .sort(sorting);
    if (!req.body.orderOnly) {
      const [total, processing, completed, cancelled] = await Promise.all([
        Transaction.countDocuments({ user_id: req.user._id }).exec(),
        Order.countDocuments({
          user_id: req.user._id,
          $or: [{ order_status: "processing" }, { order_status: "shipped" }],
        }).exec(),
        Order.countDocuments({
          user_id: req.user._id,
          order_status: "completed",
        }).exec(),
        Order.countDocuments({
          user_id: req.user._id,
          order_status: "cancelled",
        }).exec(),
      ]);
      res.json({ transaction, total, processing, completed, cancelled });
    } else {
      res.json({ transaction });
    }
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// get pending order

router.get("/pending/order", auth, async (req, res) => {
  try {
    const order = await Order.find({
      $or: [{ order_status: "processing" }, { order_status: "shipped" }],
    })
      .sort("-_id")
      .populate(["order_id", "product_id", "seller_id", "user_id"]);
    res.send(order);
  } catch (error) {
    ApiError(res, 500, error.message, error);
  }
});

// create order app
router.post("/", auth, async (req, res) => {
  try {
    if (req.body.payment_method == "esewa") {
      const resp = await esewaVerify(req.body.amt, req.body.rid, req.body.pid);
      if (!resp) return ApiError(res, 400, "Payment Verification Failed");
    } else {
      const resp = await khaltiVerify(req.body.token, req.body.amount);
      if (!resp) return ApiError(res, 400, "Payment Verification Failed");
    }
    //current user's cart items
    var addtocarts = await Addtocart.find({ user_id: req.user._id });
    //create Transaction
    var txn = await transaction(addtocarts, req.body, req.user._id);

    if (txn.status == 500) {
      return ApiError(res, 400, txn.error);
    }

    //cart => order
    for (const cart of addtocarts) {
      //Stock
      var product = await Product.findById(cart.product_id)
        .populate("brand_id")
        .populate("category_id");
      product.stock = product.stock - cart.quantity;
      await product.save();

      const pickupOrder = await createPickupOrder(req, cart, product);
      if (!pickupOrder) {
        return ApiError(res, 400, "Failed to create Pickup Order.");
      }
      //order init
      var order = new Order({
        user_id: cart.user_id,
        product_id: cart.product_id,
        quantity: cart.quantity,
        price: cart.price,
        discount: cart.discount,
        color: cart.color,
        size: cart.size,
        sku: cart.sku,
        brand: product.brand_id?.name,
        seller_id: cart.seller_id,
        note: req.body.note,
        transaction_id: txn.transaction?._id,
        shipping: req.body.shipping,
        payment_method: req.body.payment_method,
        earning: cart.earning,

        shipping_track_id: pickupOrder.orderid,
      });
      //order create
      await order.save();

      const fundClerance = await FundClearance.create({
        user_id: cart.user_id,
        seller_id: cart.seller_id,
        amount: cart.earning,
        order_id: order._id,
      });
      const user = await User.findById(cart.seller_id);
      user.pendingBalance = user.pendingBalance + cart.earning;
      await user.save();

      //cart delete
      await cart.delete();

      var orderTracker = await OrderTracker.create({
        user_id: cart.user_id,
        seller_id: cart.seller_id,
        order_id: order._id,
        product_id: cart.product_id,
        transaction_id: txn.transaction?._id,
        message: "Your package is being prepared by the seller.",
      });

      var orderNotification = new OrderNotification({
        user_id: cart.user_id,
        seller_id: cart.seller_id,
        type: "order",
        post_id: cart.product_id,
        order_id: order._id,
      });
      await orderNotification.save();
      orderNotification = await orderNotification
        .populate("user_id")
        .populate("seller_id")
        .populate("post_id")
        .populate("order_id")
        .execPopulate();
      req.sendOrderNotification(cart.seller_id, orderNotification);
      req.sendOrderNotification(cart.user_id, orderNotification);
      await sendExpoToken(
        cart.seller_id,
        `${req.user.name} has order ${product.name}`,
        "",
        { type: "order" }
      );
    }

    res.send("success");
  } catch (error) {
    console.log(error.message);
    ApiError(res, 500, "Server Error", error);
  }
});

// for web
router.post("/web/payment", auth, async (req, res) => {
  try {
    //current user's cart items
    var addtocarts = await Addtocart.find({ user_id: req.user._id });
    //create Transaction
    var txn = await transaction(addtocarts, req.body, req.user._id);
    if (txn.status == 500) {
      return ApiError(res, 500, txn.error);
    }

    txn = txn.transaction;

    for (const cart of addtocarts) {
      //Stock
      var product = await Product.findById(cart.product_id)
        .populate("brand_id")
        .populate("category_id");
      product.stock = product.stock - cart.quantity;
      await product.save();

      const pickupOrder = await createPickupOrder(req, cart, product);
      if (!pickupOrder) {
        return ApiError(res, 400, "Failed to create Pickup Order.");
      }

      //order init
      var order = new Order({
        user_id: cart.user_id,
        product_id: cart.product_id,
        quantity: cart.quantity,
        price: cart.price,
        discount: cart.discount,
        color: cart.color,
        size: cart.size,
        sku: cart.sku,
        brand: product.brand_id?.name,
        seller_id: cart.seller_id,
        note: req.body.note,
        transaction_id: txn.transaction._id,
        shipping: req.body.shipping,
        payment_method: req.body.payment_method,
        earning: cart.earning,
        shipping_track_id: pickupOrder.orderid,
      });
      //order create
      await order.save();

      const fundClerance = await FundClearance.create({
        user_id: cart.user_id,
        seller_id: cart.seller_id,
        amount: cart.earning,
        order_id: order._id,
      });

      const user = await User.findById(cart.seller_id);
      user.pendingBalance = user.pendingBalance + cart.earning;
      await user.save();

      //cart delete
      await cart.delete();

      const orderNotification = new OrderNotification({
        user_id: cart.user_id,
        seller_id: cart.seller_id,
        type: "order",
        post_id: cart.product_id,
        order_id: order._id,
      });
      await orderNotification.save();

      const data = {
        type: "order",
      };
      sendExpoToken(
        cart.seller_id,
        `${req.user.name} has order ${product.name}`,
        "",
        data
      );
    }

    res.send("success");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

async function createPickupOrder(req, cart, product) {
  try {
    const buyer = await User.findById(req.user._id);
    const shipping = await Address.findById(req.body.shipping_id);
    const pickupLocation = await PickupLocation.findOne({
      user_id: cart.seller_id,
    });
    const config2 = {
      headers: {
        Authorization: process.env.NCM_HEADER,
      },
    };

    const data = {
      name: buyer.name,
      phone: shipping.phone.toString(),
      cod_charge: "0",
      address: `${shipping.street}, ${shipping.municipality}, ${shipping.city}, ${shipping.district}`,
      branch: shipping.city,
      fbranch: pickupLocation.city,
      delivery_type: `${product.pickupOption}2${req.body.deliveryOption}`,
      package: product.category_id?.name,
      vref_id: "VREF4644",
      instruction: `Pickup the package from ${pickupLocation.street}, ${pickupLocation.municipality}, ${pickupLocation.city}, ${pickupLocation.district}. Contact number: ${pickupLocation.phone}`,
    };

    const response = await axios.post(
      "https://portal.nepalcanmove.com/api/v1/order/create",
      data,
      config2
    );
    return response.data;
  } catch (error) {
    return null;
  }
}

router.get("/", auth, async (req, res) => {
  try {
    const order = await Order.find({ user_id: req.user._id })
      .populate("user_id")
      .populate("product_id");
    res.json(order);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.post("/sales/pagination", auth, async (req, res) => {
  try {
    var perPage = 24;
    var pageNo = 0;
    if (req.body.pageno) {
      pageNo = req.body.pageno - 1;
    }
    if (req.body.itemsPerPage) {
      perPage = req.body.itemsPerPage;
    }

    var [orders, total, totalSales] = await Promise.all([
      Order.find({ seller_id: req.user._id })
        .populate("user_id")
        .populate("product_id")
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort("-_id")
        .exec(),
      Order.countDocuments({ seller_id: req.user._id }).exec(),
      Order.aggregate([
        { $match: { seller_id: mongoose.Types.ObjectId(req.user._id) } },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ["$price", "$quantity"] } },
          },
        },
      ]).exec(),
    ]);
    totalSales = totalSales.length ? totalSales[0].total : 0;
    res.send({ orders, total, totalSales });
  } catch (error) {
    console.log(error.message);
    ApiError(res, 500, error.message, error);
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    if (req.user.is_admin) {
      var orders = await Order.find()
        .populate("user_id")
        .populate("product_id")
        .sort("-_id");
    } else {
      var orders = await Order.find({ seller_id: req.user._id })
        .populate("user_id")
        .populate("product_id")
        .sort("-_id");
    }
    res.json(orders);
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.post("/generate/invoice", auth, async (req, res) => {
  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  try {
    if (!req.body.transaction_id) return ApiError(res, 400, "Id is required.");
    const transaction = await Transaction.findById(req.body.transaction_id)
      .populate("orders")
      .populate("addresses");
    const shippingAddress = transaction.addresses.find(
      (add) => add.type == "billing"
    );
    if (!transaction) return ApiError(res, 400, "Order not found.");
    var data = {
      // Customize enables you to provide your own templates
      // Please review the documentation for instructions and examples
      customize: {
        //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
      },
      images: {
        // The logo on top of your invoice
        logo: fs.readFileSync("./files/invoice-logo.png", "base64"),
        // logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
        // The invoice background
        background: fs.readFileSync("./files/paid-bg.png", "base64"),
      },
      // Your own data
      sender: {
        company: "Thrift Market Pvt Ltd",
        address: "Bharatpur 11",
        zip: "44200",
        city: "Bharatpur",
        country: "Nepal",
      },
      // Your recipient
      client: {
        company: shippingAddress.name,
        address: shippingAddress.street + ", " + shippingAddress.city,
        zip: shippingAddress.zipcode,
        city: shippingAddress.district,
        country: "Nepal",
      },
      information: {
        // Invoice number
        number: transaction.invoice_id,
        // Invoice data
        date: formatDate(transaction.createdAt),
        // Invoice due date
        "due-date": formatDate(transaction.createdAt),
      },
      // The products you would like to see on your invoice
      // Total values are being calculated automatically
      products: [],
      // The message you would like to display on the bottom of your invoice
      "bottom-notice": "Thank you for shopping with us.",
      // Settings to customize your invoice
      settings: {
        currency: "NPR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
        // locale: "de-DE", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')
        // "tax-notation": "gst", // Defaults to 'vat'
        // "margin-top": 25, // Defaults to '25'
        // "margin-right": 25, // Defaults to '25'
        // "margin-left": 25, // Defaults to '25'
        // "margin-bottom": 25, // Defaults to '25'
        // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
        // "height": "1000px", // allowed units: mm, cm, in, px
        // "width": "500px", // allowed units: mm, cm, in, px
        // "orientation": "landscape", // portrait or landscape, defaults to portrait
      },
      // Translate your invoice to your preferred language
      translate: {
        // "invoice": "FACTUUR",  // Default to 'INVOICE'
        number: "Invoice #", // Defaults to 'Number'
        // "date": "Datum", // Default to 'Date'
        "due-date": "Paid On", // Defaults to 'Due Date'
        // "subtotal": "Subtotaal", // Defaults to 'Subtotal'
        // "products": "Producten", // Defaults to 'Products'
        // "quantity": "Aantal", // Default to 'Quantity'
        // "price": "Prijs", // Defaults to 'Price'
        // "product-total": "Totaal", // Defaults to 'Total'
        // "total": "Totaal" // Defaults to 'Total'
      },
    };
    transaction.orders.map((order) => {
      data.products.push({
        quantity: order.quantity,
        description: order.product_id?.name,
        "tax-rate": 0,
        price: order.price,
      });
    });
    const result = await easyinvoice.createInvoice(data);
    var filePath = "./files/";
    var filename = new Date().getTime();
    fs.writeFileSync(filePath + filename + ".pdf", result.pdf, "base64");
    res.send(process.env.DOMAIN + "/api/order/invoice/download/" + filename);
  } catch (error) {
    ApiError(res, 500, error.message, error);
  }
});

router.get("/invoice/download/:id", async (req, res) => {
  try {
    var filePath = "./files/" + req.params.id + ".pdf";
    if (!fs.existsSync(filePath))
      return res.status(404).json("Invalid or Expired ID");

    res.download(filePath, `invoice-${req.params.id}.pdf`, function (err) {
      if (err) {
        return res.status(404).json(err);
      }
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    ApiError(res, 500, error.message, error);
  }
});

router.post("/generate/shipping-label", auth, async (req, res) => {
  try {
    // Get Order Details and Other Details

    const order = await Order.findById(req.body.order_id)
      .populate("seller_id")
      .populate("addresses");
    const shippingAddress = order.addresses.find(
      (add) => add.type == "shipping"
    );

    var filePath = "./files/";
    // QRCode Generator
    var qrcode_image = await QRCode.toDataURL(
      `${shippingAddress?.name} - ${shippingAddress?.phone} - ${shippingAddress?.street},
            ${shippingAddress?.city}, ${shippingAddress?.municipality}, ${shippingAddress?.district}`,
      { width: 178 }
    );

    // Barcode Generator
    var canvas = createCanvas();
    JsBarcode(canvas, order.shipping_track_id || "undefined", {
      width: 3,
      text: `Tracking Number: ${order.shipping_track_id}`,
    });
    var barcode_image = canvas.toDataURL("image/png");

    // Generate HTML File with all data
    var template = fs.readFileSync(filePath + "shipping-label.html", "utf-8");
    var html = ejs.render(template, {
      qrcode_image,
      barcode_image,
      order,
      shippingAddress,
      date: moment(order.createdAt).format("DD MMM YYYY"),
    });

    // Create PDF File and Save It
    var filename = new Date().getTime();
    pdf.create(html).toFile(filePath + filename + ".pdf", function (err, data) {
      if (err) return res.send(err);
      res.send(
        process.env.DOMAIN + "/api/order/shipping-label/download/" + filename
      );
    });
  } catch (error) {
    ApiError(res, 500, error.message, error);
  }
});

router.get("/shipping-label/download/:id", async (req, res) => {
  try {
    var filePath = __dirname + "/../files/" + req.params.id + ".pdf";
    console.log(filePath);
    if (!fs.existsSync(filePath))
      return res.status(404).json("Invalid or Expired ID");

    res.download(
      filePath,
      `shipping-label-${req.params.id}.pdf`,
      function (err) {
        if (err) {
          return res.status(404).json(err);
        }
        fs.unlinkSync(filePath);
      }
    );
  } catch (error) {
    ApiError(res, 500, error.message, error);
  }
});

router.get("/sales/get/order/:id", auth, async (req, res) => {
  try {
    var order = await Order.findById(req.params.id)
      .populate("user_id")
      .populate("seller_id")
      .populate("product_id")
      .populate("addresses");
    res.json(order);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.get("/sales/get/:id", async (req, res) => {
  try {
    var orders = await Order.find({ seller_id: req.params.id })
      .populate("user_id")
      .populate("product_id");
    res.json(orders);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/sales/get/:id", async (req, res) => {
  var perPage = 24;
  var pageNo = 0;
  var sorting = "-_id";
  if (req.body.pageno) {
    pageNo = req.body.pageno - 1;
  }
  if (req.body.sorting) {
    sorting = req.body.sorting;
  }
  try {
    var orders = await Order.aggregate([
      {
        $match: {
          seller_id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $skip: perPage * pageNo,
      },
      {
        $limit: perPage,
      },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product_id",
        },
      },
      {
        $unwind: {
          path: "$product_id",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "brands",
          localField: "product_id.brand_id",
          foreignField: "_id",
          as: "product_id.brand_id",
        },
      },
      {
        $unwind: {
          path: "$product_id.brand_id",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "product_id.category_id",
          foreignField: "_id",
          as: "product_id.category_id",
        },
      },
      {
        $unwind: {
          path: "$product_id.category_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "sizes",
          localField: "product_id.size_id",
          foreignField: "_id",
          as: "product_id.size_id",
        },
      },
      {
        $unwind: {
          path: "$product_id.size_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "colors",
          localField: "product_id.color_id",
          foreignField: "_id",
          as: "product_id.color_id",
        },
      },
      {
        $unwind: {
          path: "$product_id.color_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "product_id.seller_id",
          foreignField: "_id",
          as: "product_id.seller_id",
        },
      },
      {
        $unwind: {
          path: "$product_id.seller_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "product_id._id",
          foreignField: "post_id",
          as: "product_id.likes",
        },
      },
      {
        $lookup: {
          from: "orderaddresses",
          localField: "transaction_id",
          foreignField: "transaction_id",
          as: "addresses",
        },
      },
    ]);
    if (!req.body.orderOnly) {
      const [processing, completed, cancelled] = await Promise.all([
        Order.countDocuments({
          seller_id: req.params.id,
          $or: [{ order_status: "processing" }, { order_status: "shipped" }],
        }).exec(),
        Order.countDocuments({
          seller_id: req.params.id,
          order_status: "completed",
        }).exec(),
        Order.countDocuments({
          seller_id: req.params.id,
          order_status: "cancelled",
        }).exec(),
      ]);
      const total = processing + completed + cancelled;
      res.json({ orders, total, processing, completed, cancelled });
    } else {
      res.json(orders);
    }
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.post("/ongoing", auth, async (req, res) => {
  try {
    const response = await Order.findOne({
      product_id: req.body.product_id,
      seller_id: req.user._id,
      order_status: "processing",
    });
    if (response) {
      res.json("Order is ongoing.");
    } else {
      ApiError(res, 404, "No ongoing order found.");
    }
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/orderstatus", auth, async (req, res) => {
  try {
    if (req.user.is_admin == 1) {
      var order = await Order.findById(req.body.id);
      order.order_status = req.body.order_status;
      if (req.body.order_status == "shipped") {
        const orderNotification = new OrderNotification({
          user_id: order.user_id,
          seller_id: order.seller_id,
          type: "shipped",
          post_id: order.product_id,
          order_id: order._id,
        });
        await orderNotification.save();
      }
      if (req.body.order_status == "completed") {
        const orderNotification = new OrderNotification({
          user_id: order.user_id,
          seller_id: order.seller_id,
          type: "completed",
          post_id: order.product_id,
          order_id: order._id,
        });
        await orderNotification.save();
        const pendingFund = await FundClearance.findOne({
          order_id: order._id,
        });
        if (pendingFund) {
          pendingFund.status = "completed";
          var today = new Date();
          var duration = process.env.CLEARANCE_DATE || 3; //In Days
          today.setTime(today.getTime() + duration * 24 * 60 * 60 * 1000);
          var clearanceDate = today.getTime();
          pendingFund.clearance_date = clearanceDate;
          await pendingFund.save();
        }
      }
      await order.save();
      res.send("success");
    } else {
      ApiError(res, 400, "No Permission");
    }
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

async function khaltiVerify(token, amount) {
  const config = {
    headers: {
      Authorization: process.env.KHALTI_SECRET,
    },
  };
  const data = {
    token: token,
    amount: amount,
  };
  try {
    var response = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      data,
      config
    );
    return response.data;
  } catch (error) {
    return false;
  }
}

async function esewaVerify(amt, rid, pid) {
  try {
    const params = {
      amt,
      rid,
      pid,
      scd: process.env.ESEWA_SECRET,
    };
    var response = await axios.get("https://esewa.com.np/epay/transrec", {
      params: { ...params },
    });
    if (response.data.includes("Success")) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

module.exports = router;
