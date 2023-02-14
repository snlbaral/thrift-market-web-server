const ExpoToken = require("../Models/ExpoToken");
const axios = require("axios").default;
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

async function sendExpoToken(user_id, title, body, data = {}) {
  try {
    const expo_users = await ExpoToken.find({ user_id: user_id });
    for (const user of expo_users) {
      console.log(user);
      const message = {
        to: user.token,
        sound: "default",
        title: title,
        body: body,
        data: data,
      };
      const api = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        message
      );
      console.log(api);
    }
  } catch (error) {
    console.log(error.message);
  }
  return "OK";
}

async function fileUploadFormData(file) {
  var fileName = new Date().getTime() + "." + file.name.split(".").pop();
  var filePath = "/images/" + fileName;
  const uploadPath = process.env.IMAGE_UPLOAD_PATH + fileName;
  const error = await file.mv(uploadPath);
  if (error) {
    return { status: 500, data: error.message };
  }
  return { status: 200, data: filePath };
}

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

function videoUpload(video) {
  return "";
}

function removeFile(filePathInDB) {
  const fileName = new String(filePathInDB).substring(
    filePathInDB.lastIndexOf("/") + 1
  );
  const filePath = process.env.IMAGE_UPLOAD_PATH + fileName;
  fs.unlinkSync(filePath);
}

module.exports = {
  sendExpoToken,
  imageUpload,
  videoUpload,
  fileUploadFormData,
  removeFile,
};
