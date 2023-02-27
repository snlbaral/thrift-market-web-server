const express = require("express");
const ApiError = require("../Middleware/ApiError");
const auth = require("../Middleware/auth");
const { sendExpoToken } = require("../Middleware/helpers");
const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");
const router = express.Router();

router.post("/conversation", auth, async (req, res) => {
  try {
    var perPage = 12;
    var pageNo = 0;
    var sorting = "-_id";
    if (req.body.pageNo) {
      pageNo = req.body.pageNo - 1;
    }
    if (req.body.sorting) {
      sorting = req.body.sorting;
    }

    const conversation = await Conversation.find({
      last_message: { $ne: null },
    })
      .limit(perPage)
      .skip(perPage * pageNo)
      .or([{ sender_id: req.user._id }, { receiver_id: req.user._id }])
      .sort("-updatedAt")
      .populate("sender_id")
      .populate("receiver_id");
    const allConversations = [];

    for (let convo of conversation) {
      convo = convo.toObject();
      let unread_count = 0;
      if (convo.sender_id == req.user._id) {
        unread_count = convo.sender_id_unread_count;
      }
      if (convo.receiver_id == req.user._id) {
        unread_count = convo.receiver_id_unread_count;
      }
      allConversations.push({ ...convo, unread_count: unread_count });
    }
    res.json(allConversations);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.get("/message/unread-count", auth, async (req, res) => {
  try {
    const unread_count = await Message.countDocuments({
      receiver_id: req.user._id,
      seen: false,
    });
    res.json(unread_count);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/newchat", auth, async (req, res) => {
  try {
    const chat = await Conversation.findOne()
      .or([
        { sender_id: req.user._id, receiver_id: req.body.receiver_id },
        { sender_id: req.body.receiver_id, receiver_id: req.user._id },
      ])
      .populate("sender_id")
      .populate("receiver_id");
    if (chat) {
      return res.json(chat);
    }
    const newchat = new Conversation({
      sender_id: req.user._id,
      receiver_id: req.body.receiver_id,
    });
    await newchat.save();
    res.json(newchat);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/message/get/:id", auth, async (req, res) => {
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

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return ApiError(res, 404, "Conversation not found");
    // Update Unread Count in Conversation
    if (conversation.sender_id == req.user._id) {
      conversation.sender_id_unread_count = 0;
      await conversation.save();
    }
    if (conversation.receiver_id == req.user._id) {
      conversation.receiver_id_unread_count = 0;
      await conversation.save();
    }
    const messages = await Message.find({ conversation_id: req.params.id })
      .limit(perPage)
      .skip(perPage * pageNo)
      .sort(sorting);
    // Make Messages Seen
    await Message.updateMany(
      { conversation_id: req.params.id, receiver_id: req.user._id },
      {
        seen: true,
      },
      { multi: true }
    );
    res.json(messages);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

router.post("/message/:id", auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate({
        path: "sender_id",
        select: "-interests",
      })
      .populate({
        path: "receiver_id",
        select: "-interests",
      });
    if (!conversation) return ApiError(res, 404, "Conversation not found");
    if (conversation.sender_id._id == req.body.receiver_id) {
      conversation.sender_id_unread_count += 1;
    }
    if (conversation.receiver_id._id == req.body.receiver_id) {
      conversation.receiver_id_unread_count += 1;
    }
    conversation.last_message = req.body.message;
    await conversation.save();
    var message = new Message({
      sender_id: req.body.sender_id,
      receiver_id: req.body.receiver_id,
      fromMe: req.body.fromMe,
      conversation_id: req.params.id,
      message: req.body.message,
      seen: false,
    });
    message = await message.save();

    sendExpoToken(
      req.body.receiver_id,
      "New Message",
      `[${req.user.name}]: ${req.body.message}`,
      {
        user:
          req.user._id == conversation.sender_id?._id
            ? conversation.sender_id
            : conversation.receiver_id,
        conversation,
        type: "message",
      }
    );

    res.json(message);
  } catch (error) {
    ApiError(res, 500, "Server Error", error);
  }
});

module.exports = router;
