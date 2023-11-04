const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { createRoom, joinRoom } = require("../controllers/room_controllers");

const roomRouter = Router();

const authenticateUserToken = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Unauthorized - Token not provided" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
    if (err)
      return res.status(403).json({ error: "Unauthorized - Invalid token!" });
    const { email } = data;
    req.email = email;
    next();
  });
};

roomRouter.post("/create-room", authenticateUserToken, createRoom);

roomRouter.post("/join-room", authenticateUserToken, joinRoom);

module.exports = { roomRouter };
