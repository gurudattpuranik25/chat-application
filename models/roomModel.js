const mongoose = require("mongoose");

const RoomSchema = mongoose.Schema({
  roomID: String,
  participants: [String],
});

module.exports = mongoose.model("Room", RoomSchema);
