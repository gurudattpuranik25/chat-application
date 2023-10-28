const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  message: String,
  time: String,
  senderName: String,
  receiverName: String,
});

module.exports = mongoose.model("Message", MessageSchema);
