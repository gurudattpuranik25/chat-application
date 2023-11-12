const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const setupSocketIO = async (io) => {
  io.on("connection", async (socket) => {
    // check for user token
    const token = socket.handshake.headers.token;

    if (!token) {
      socket.emit("error", "Un-authorized handshake. Token is missing");
      return socket.disconnect();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      socket.emit("error", "Un-authorized handshake. Token is invalid");
      return socket.disconnect();
    }
    socket.user = user;
    console.log("User connected -> userId:", user.id);
    socket.join(user.id.toString());

    socket.on("disconnect", () => {
      console.log("User disconnected -> userId:", socket.user?.id);
      socket.leave(socket.user?.id);
    });
  });
};

const emitSocketEvent = (req, room, event, payload) => {
  req.app.get("io").in(room).emit(event, payload);
};

module.exports = { setupSocketIO, emitSocketEvent };
