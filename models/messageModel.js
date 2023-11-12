const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  roomID: String,
  userID: String,
  message: String,
});

module.exports = mongoose.model("Message", MessageSchema);
