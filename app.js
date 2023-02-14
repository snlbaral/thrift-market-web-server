const mongoose = require("mongoose");
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const user = require("./Routes/user");
const category = require("./Routes/category");
const brand = require("./Routes/brand");
const product = require("./Routes/product");
const size = require("./Routes/size");
const color = require("./Routes/color");
const banner = require("./Routes/banner");
const addtocart = require("./Routes/addtocart");
const address = require("./Routes/address");
const order = require("./Routes/order");
const shipping = require("./Routes/shipping");
const frontend = require("./Routes/frontend");
const district = require("./Routes/district");
const city = require("./Routes/city");
const chat = require("./Routes/chat");
const cors = require("cors");
const post = require("./Routes/post");
const story = require("./Routes/story");
const notification = require("./Routes/notification");
const Conversation = require("./Models/Conversation");
const ordernotification = require("./Routes/orderNotification");
const orderTracker = require("./Routes/orderTracker");
const location = require("./Routes/location");
const Redis = require("ioredis");

var bodyParser = require("body-parser");
require("dotenv").config();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
var users = [];

function addUser(socket, userId) {
  var index = users.findIndex((user) => user.userId == userId);
  if (index == -1) {
    users.push({
      userId: userId,
      socketId: socket.id,
    });
  } else {
    users[index].socketId = socket.id;
  }
}

function removeUser(socket) {
  users = users.filter((user) => user.socketId != socket.id);
}

function findUserByUserId(userId) {
  return users.find((user) => user.userId == userId);
}

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    console.log("user join", userId);
    addUser(socket, userId);
  });

  socket.on("sendMessage", async (message) => {
    var user = findUserByUserId(message.receiver_id);
    if (user) {
      socket.to(user.socketId).emit("receiveMessage", message);
      var conversation = await Conversation.findById(message.conversation_id)
        .populate("sender_id")
        .populate("receiver_id");
      socket.to(user.socketId).emit("conversation", conversation);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket);
  });
});

try {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
} catch (err) {
  //console.log(err.message);
}

function sendNotification(user_id, notification) {
  var user = findUserByUserId(user_id);
  if (user) {
    io.to(user.socketId).emit("notification", notification);
  }
}
function sendOrderNotification(user_id, notification) {
  var user = findUserByUserId(user_id);
  if (user) {
    io.to(user.socketId).emit("orderNotification", notification);
  }
}

// Redis Config
const redisClient = new Redis(6379, "38.242.213.113");
app.use(async function (req, res, next) {
  req.sendNotification = sendNotification;
  req.sendOrderNotification = sendOrderNotification;
  req.redisClient = redisClient;
  next();
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(fileUpload());
app.use("/api/user", user);
app.use("/api/chat", chat);
app.use("/api/category", category);
app.use("/api/brand", brand);
app.use("/api/product", product);
app.use("/api/size", size);
app.use("/api/color", color);
app.use("/api/banner", banner);
app.use("/api/addtocart", addtocart);
app.use("/api/address", address);
app.use("/api/order", order);
app.use("/api/shipping", shipping);
app.use("/api/frontend", frontend);
app.use("/api/city", city);
app.use("/api/district", district);
app.use("/api/post", post);
app.use("/api/story", story);
app.use("/api/notification", notification);
app.use("/api/order-notification", ordernotification);
app.use("/api/order-track", orderTracker);
app.use("/api/location", location);
app.use("/files", express.static("files"));

//main()

if (process.env.NODE_ENV == "production") {
  app.use("/images", express.static("images"));
  app.use(express.static("thrifted/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "thrifted", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("started", PORT);
});
