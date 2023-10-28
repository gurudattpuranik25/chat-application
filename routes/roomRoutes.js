const { Router } = require("express");
const { createRoom, joinRoom } = require("../controllers/room_controllers");

const roomRouter = Router();

roomRouter.post("/create-room", createRoom);

roomRouter.post("/join-room", joinRoom);

module.exports = { roomRouter };
