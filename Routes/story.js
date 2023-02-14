const { Router } = require("express");
const router = Router();
const Story = require("../Models/Story");
const auth = require("../Middleware/auth");
const { imageUpload, videoUpload } = require("../Middleware/helpers");
const ApiError = require("../Middleware/ApiError");

// Create a new story
router.post("/", auth, async (req, res) => {
  try {
    if (!req.body.image && !req.body.video) {
      return ApiError(res, 400, "Image/Video is required");
    }
    var image = "";
    if (req.body.image) {
      image = imageUpload(req.body.image);
    }
    var video = "";
    if (req.body.video) {
      video = videoUpload(req.body.video);
    }
    let story = new Story({
      user_id: req.user._id,
      user_name: req.user.name,
      user_image:
        req.user.image ||
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
      media_type: req.body.media_type || "image",
      swipeText: req.body.swipeText,
      story_image: image,
      story_video: video,
    });
    story = await story.save();
    res.send(story);
  } catch (error) {
    ApiError(res, 500, error.message, error);
  }
});

// Delete story By ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const story = await Story.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });
    res.send(story);
  } catch (error) {
    ApiError(res, 500, error.message, error);
  }
});

module.exports = router;
