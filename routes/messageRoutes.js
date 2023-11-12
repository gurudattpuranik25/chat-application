const { Router } = require("express");
const {
  sendMessage,
  getMessageHistory,
} = require("../controllers/message_controllers");
const {
  authenticateUserToken,
} = require("../middleware/authenticateUserToken");

const messageRouter = Router();

messageRouter.post("/send", authenticateUserToken, sendMessage);
messageRouter.post("/messageHistory", authenticateUserToken, getMessageHistory);

module.exports = { messageRouter };
