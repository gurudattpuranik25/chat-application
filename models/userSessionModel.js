const mongoose = require("mongoose");

const UserSessionSchema = mongoose.Schema({
  sessionID: String,
  accessToken: String,
});

module.exports = mongoose.model("session", UserSessionSchema);
