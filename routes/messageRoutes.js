const { Router } = require("express");
const { sendMessage } = require("../controllers/message_controllers");
const {
  authenticateUserToken,
} = require("../middleware/authenticateUserToken");

const messageRouter = Router();

messageRouter.post("/send", authenticateUserToken, sendMessage);

module.exports = { messageRouter };
