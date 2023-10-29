const express = require("express");
const cors = require("cors");
const { authRouter } = require("./routes/authRoutes");
const { roomRouter } = require("./routes/roomRoutes");
const { mongodb } = require("./mongodb/mongodb");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

const PORT = 3000;

const app = express();

mongodb();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(express.static("../public"));

app.get("/", (req, res) => {
  res.sendFile("../public/index.html");
});

app.use("/auth", authRouter);
app.use("/rooms", roomRouter);

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("chat message", (message) => {
    console.log("message: " + message);
    socket.broadcast.emit("chat message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
