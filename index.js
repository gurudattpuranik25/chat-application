const express = require("express");
const cors = require("cors");
const { authRouter } = require("./routes/authRoutes");
const { roomRouter } = require("./routes/roomRoutes");
const { messageRouter } = require("./routes/messageRoutes");
const { mongodb } = require("./mongodb/mongodb");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const { setupSocketIO } = require("./socketIO/connectSocketIO");

const PORT = 3000;

// create an instance of express
const app = express();

// mongodb connection
mongodb();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// routes
app.use("/auth", authRouter);
app.use("/rooms", roomRouter);
app.use("/messages", messageRouter);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found!" });
});

const server = createServer(app);

// instance of socketio connection
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.set("io", io);

setupSocketIO(io);

// listen to the connection
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
