const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    user_name: { type: String, required: true },
    user_image: { type: String, required: true },
    media_type: { type: String, default: "image" },
    story_image: { type: String },
    swipeText: { type: String },
    story_video: { type: String },
  },
  {
    timestamps: true,
  }
);

const Story = mongoose.model("Story", StorySchema);

module.exports = Story;
