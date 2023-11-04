const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  message: String,
  senderName: String,
});

module.exports = mongoose.model("Message", MessageSchema);
