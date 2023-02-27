const express = require("express");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/auth");
const adminAuth = require("../Middleware/adminAuth");
const bcrypt = require("bcrypt");
const Withdraw = require("../Models/Withdraw");
const nodemailer = require("nodemailer");
const { v4: uuidv4, NIL } = require("uuid");
const router = express.Router();
const Joi = require("joi");
const Validation = require("../Middleware/Validation");
const fs = require("fs");
const Notification = require("../Models/Notification");
const ApiError = require("../Middleware/ApiError");
const PickupLocation = require("../Models/PickupLocation");
const {
  PhoneAuthProvider,
  signInWithCredential,
} = require("firebase-admin/auth");
const { firebaseAuth } = require("../FirebaseConfig");

router.get("/", adminAuth, async (req, res) => {
  try {
    const user = await User.find({ is_admin: { $ne: 1 } });
    res.json(user);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.get("/currentuser", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("addresses");
    res.json({ user });
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.post("/make-seller", auth, async (req, res) => {
  try {
    const pickup = await PickupLocation.create({
      user_id: req.user._id,
      phone: req.body.phone,
      district: req.body.district,
      city: req.body.city,
      street: req.body.street,
      name: req.body.name,
      municipality: req.body.municipality,
    });
    await User.findByIdAndUpdate(req.user._id, {
      is_seller: 1,
    });
    res.json("success");
  } catch (error) {
    console.log("error");
    ApiError(res, 500, "Server Error", error);
  }
});

router.get("/pickup-location/get", auth, async (req, res) => {
  try {
    const location = await PickupLocation.findOne({ user_id: req.user._id });
    res.json(location);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.put("/change-pickup-location/:id", auth, async (req, res) => {
  try {
    await PickupLocation.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      {
        phone: req.body.phone,
        district: req.body.district,
        city: req.body.city,
        street: req.body.street,
        name: req.body.name,
        municipality: req.body.municipality,
      }
    );
    res.json("success");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.get("/admin", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const user = await User.find().or([{ is_admin: 1 }, { role: "seller" }]);
    res.json(user);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.get("/userall", async (req, res) => {
  try {
    const users = await User.find().select("-email -password -balance -phone");
    res.json(users);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// login
router.post("/", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }
  try {
    const login = await User.findOne({ email: req.body.email });
    if (login) {
      const valid = await bcrypt.compare(req.body.password, login.password);
      if (valid) {
        const token = jwt.sign(
          {
            _id: login._id,
            is_admin: login.is_admin,
            name: login.name,
            email: login.email,
            image: login.image,
            is_seller: login.is_seller,
          },
          "thrifted"
        );
        res.json({ token: token, is_admin: login.is_admin });
      } else {
        ApiError(res, 400, "Invalid Email or Password.");
      }
    } else {
      ApiError(res, 400, "Invalid Email or Password.");
    }
  } catch (err) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/follow/:id", auth, async (req, res) => {
  try {
    // Check if User ID is valid
    const userCheck = await User.findById(req.params.id);
    if (!userCheck) return ApiError(res, 400, "User not found.");
    // Check if both User ID is same
    if (req.params.id == req.user._id)
      return ApiError(res, 400, "You can not follow yourself.");
    // Check if already following
    const alreadyFollowing = await User.findOne({
      _id: req.params.id,
      followers: req.user._id,
    });
    if (alreadyFollowing)
      return ApiError(res, 400, "You've already followed this user");

    // Add User ID to your following list
    await User.findByIdAndUpdate(req.user._id, {
      $push: { followings: req.params.id },
    });

    // Add yourself to User ID's follower's list
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    );

    var notification = new Notification({
      user_id: req.params.id,
      type: "follow",
      follower_id: req.user._id,
      post_id: req.user._id,
    });
    await notification.save();
    notification = await notification
      .populate("follower")
      .populate("post")
      .execPopulate();
    req.sendNotification(req.params.id, notification);

    res.json(user);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/unfollow/:id", auth, async (req, res) => {
  try {
    // Check if User ID is valid
    const userCheck = await User.findById(req.params.id);
    if (!userCheck) return ApiError(res, 400, "User not found.");
    // Check if both User ID is same
    if (req.params.id == req.user._id)
      return ApiError(res, 400, "You can not un-follow yourself.");
    // Check if already following
    const alreadyFollowing = await User.findOne({
      _id: req.params.id,
      followers: req.user._id,
    });
    if (!alreadyFollowing)
      return ApiError(res, 400, "You've not followed this user");

    // Remove User ID to your following list
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { followings: req.params.id },
    });

    await Notification.findOneAndDelete({
      type: "follow",
      user_id: req.params.id,
      follower_id: req.user._id,
    });

    // Remove yourself to User ID's follower's list
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/withdraw/pagination", auth, async (req, res) => {
  try {
    var perPage = 10;
    var pageNo = 0;
    if (req.body.pageno) {
      pageNo = req.body.pageno - 1;
    }
    if (req.body.perPage) {
      perPage = req.body.perPage;
    }
    const [withdraw, total] = await Promise.all([
      Withdraw.find({ seller_id: req.user._id })
        .populate("seller_id")
        .limit(perPage)
        .skip(perPage * pageNo)
        .sort("-_id")
        .exec(),
      Withdraw.countDocuments({ seller_id: req.user._id }).exec(),
    ]);
    res.json({ withdraw, total });
  } catch (error) {
    ApiError(res, 500, error.message, error);
  }
});

// withdraw
router.get("/withdraw", auth, async (req, res) => {
  try {
    if (req.user.is_admin == 1) {
      const withdraw = await Withdraw.find()
        .populate("seller_id")
        .sort("-createdAt");
      res.json(withdraw);
    } else {
      const withdraw = await Withdraw.find({ seller_id: req.user._id })
        .populate("seller_id")
        .sort("-createdAt");
      res.json(withdraw);
    }
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/withdraw/status", adminAuth, async (req, res) => {
  const schema = Joi.object({
    withdrawId: Joi.string().required(),
    status: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }
  try {
    var withdraw = await Withdraw.findById(req.body.withdrawId);
    withdraw.status = req.body.status;
    await withdraw.save();
    res.json(withdraw);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// Register
router.post("/all", async (req, res) => {
  var schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
    gender: Joi.string().allow(null, ""),
  });
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return ApiError(res, 400, error.message);
    }
    const isUserExists = await User.findOne({ email: req.body.email });
    if (isUserExists) {
      return ApiError(res, 400, "User already exists with this email.");
    }
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(req.body.password, salt);
    var user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hasPassword,
      phone: req.body.phone,
      gender: req.body.gender,
      image: "/files/userImg.jpg",
    });
    user = await user.save();
    var token = jwt.sign(
      {
        _id: user._id,
        is_admin: user.is_admin,
        name: user.name,
        email: user.email,
        image: user.image,
        is_seller: user.is_seller,
      },
      "thrifted"
    );
    res.json({ token: token, is_admin: user.is_admin });
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.post("/check/email", async (req, res) => {
  try {
    const [email, phone] = await Promise.all([
      User.findOne({ email: req.body.email }).exec(),
      User.findOne({ phone: req.body.phone }).exec(),
    ]);
    if (email) {
      return ApiError(res, 400, "Email is already taken");
    }
    if (phone) {
      return ApiError(res, 400, "Phone is already taken");
    }
    res.status(200).json("Ok");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/forgot/check/phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      return ApiError(res, 400, "User not found.");
    }
    res.status(200).json("Ok");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.put("/:id", auth, async (req, res) => {
  var schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(req.body.password, salt);

    const user = await User.findOneAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        email: req.body.email,
        password: hasPassword,
      },
      { new: true }
    );
    res.json("OK");
  } catch (err) {
    ApiError(res, 500, "Server Error", err);
  }
});

router.post("/withdraw/all", auth, async (req, res) => {
  try {
    var perPage = 12;
    var pageNo = 0;
    if (req.body.pageNo) {
      pageNo = req.body.pageNo - 1;
    }

    var detail = await Withdraw.find({ seller_id: req.user._id })
      .sort("-_id")
      .skip(pageNo * perPage)
      .limit(perPage);
    res.json(detail);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/withdraw", auth, async (req, res) => {
  var schema = Joi.object({
    balance: Joi.number()
      .required()
      .min(100)
      .message("Withdraw amount should be greater than 100"),
    payment_method: Joi.string().required(),
    account_detail: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }

  try {
    var user = await User.findById(req.user._id);
    if (user.balance < req.body.balance) {
      return ApiError(
        res,
        400,
        "Request amount is greater than available balance",
        error
      );
    }
    user.balance = user.balance - req.body.balance;
    user = await user.save();

    var withdraw = new Withdraw({
      seller_id: req.user._id,
      amount: req.body.balance,
      payment_method: req.body.payment_method,
      account_detail: req.body.account_detail,
    });
    withdraw = await withdraw.save();
    res.json("success");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// change closet avatar in app
router.post("/change/avatar", auth, async (req, res) => {
  var schema = Joi.object({
    image: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }
  try {
    var imageName = uuidv4() + ".png";
    var picture = "/images/" + imageName;
    const uploadPath = process.env.IMAGE_UPLOAD_PATH + imageName;
    var imgBase64 = req.body.image;
    var base64Data = imgBase64.replace(/^data:image\/\w+;base64,/, "");
    fs.writeFile(uploadPath, base64Data, "base64", function (err) {
      console.log(err);
    });
    const user = await User.findById(req.user._id);
    user.image = picture;
    await user.save();
    res.json(picture);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// chnage closet avatar in web
router.post("/change/profileimg", auth, async (req, res) => {
  if (req.files.image) {
    try {
      const image = req.files.image;

      var image_name = new Date().getTime() + "." + image.name.split(".").pop();

      //Database
      var picture = "/images/" + image_name;
      const uploadPath = process.env.IMAGE_UPLOAD_PATH + image_name;
      image.mv(uploadPath, (error) => {
        if (error) {
          return ApiError(res, 500, "Server Error", error);
        }
      });

      const user = await User.findById(req.user._id);
      user.image = picture;
      await user.save();

      res.json(picture);
    } catch (error) {
      ApiError(res, 500, "Server Error", error);
    }
  } else {
    ApiError(res, 400, "Image is required.");
  }
});

router.post("/change/profile", auth, async (req, res) => {
  const schema = Joi.object({
    bio: Joi.string().allow(null, ""),
    name: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return ApiError(res, 400, error.message);
  try {
    await User.findByIdAndUpdate(req.user._id, req.body);
    res.json("Success");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// change password
router.post("/change/password", auth, async (req, res) => {
  var schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return ApiError(res, 400, error.message);
  }
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const valid = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (valid) {
        if (req.body.newPassword == req.body.confirmPassword) {
          const salt = await bcrypt.genSalt(10);
          const hasPassword = await bcrypt.hash(req.body.newPassword, salt);
          const changePassword = await User.findByIdAndUpdate(
            req.user._id,
            {
              password: hasPassword,
            },
            { new: true }
          );
          res.json("success");
        } else {
          return ApiError(res, 400, "Password did not match");
        }
      } else {
        return ApiError(res, 400, "Current password did not match");
      }
    } else {
      return ApiError(res, 400, "User not found");
    }
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

// forgot password
router.post("/forgot/password", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    if (user) {
      user.verifyKey = req.body.code;
      user.save();
      res.json("success");
    } else {
      ApiError(res, 400, "User not found");
    }
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

async function checkOTP({ code, OTP }) {
  try {
    const credential = PhoneAuthProvider.credential(code, OTP);
    const response = await signInWithCredential(firebaseAuth, credential);
    return true;
  } catch (error) {
    return false;
  }
}

router.post("/reset/password", async (req, res) => {
  try {
    const isValid = await checkOTP(req.body);
    console.log(isValid);
    if (!isValid)
      return ApiError(
        res,
        400,
        "Invalid OTP or OTP Code expired. Please try again."
      );
    if (req.body.newPassword == req.body.confirmPassword) {
      const salt = await bcrypt.genSalt(10);
      const hasPassword = await bcrypt.hash(req.body.newPassword, salt);
      const user = await User.findOne({ verifyKey: req.body.code });
      if (user) {
        user.password = hasPassword;
        user.verifyKey = uuidv4();
        await user.save();
        res.json("success");
      } else {
        return ApiError(res, 400, "Invalid user email");
      }
    } else {
      return ApiError(res, 400, "Password does not match");
    }
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/closet/cover", auth, async (req, res) => {
  try {
    if (req.files) {
      var image = req.files.cover;
      var imageName = new Date().getTime() + "." + image.name.split(".").pop();
      var picture = "/images/" + imageName;
      var uploadPath = process.env.IMAGE_UPLOAD_PATH + imageName;
      image.mv(uploadPath, (error) => {
        if (error) {
          return ApiError(res, 500, "Server Error", error);
        }
      });
    } else {
      var picture = "";
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        cover: picture,
      },
      { new: true }
    );
    res.json(picture);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/contact/form", async (req, res) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "tutorialnative@gmail.com", // generated ethereal user
        pass: "ulgdhntjavnqrgto", // generated ethereal password
      },
    });
    let info = await transporter.sendMail({
      from: '"Lugasatam.com" <support@lugasatam.com>', // sender address
      to: "tutorialnative@gmail.com", // list of receivers
      subject: req.body.suject, // Subject line
      html: `<h3>user name</h3>: ${req.body.name}
                    <h3>email</h3>: ${req.body.email}
                    <p>${req.body.message}</p>`,
    });
    res.json("success");
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

module.exports = router;
