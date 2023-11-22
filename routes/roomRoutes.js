const { Router } = require("express");
const {
  createRoom,
  joinRoom,
  leaveRoom,
} = require("../controllers/room_controllers");
const {
  authenticateUserToken,
} = require("../middleware/authenticateUserToken");

const roomRouter = Router();

// verify the accessToken before creating or joining a room

// room routes with middleware that verifies the accessToken
roomRouter.post("/create-room", authenticateUserToken, createRoom);

roomRouter.post("/join-room", authenticateUserToken, joinRoom);

roomRouter.post("/leave-room", authenticateUserToken, leaveRoom);

module.exports = { roomRouter };
