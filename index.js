const express = require("express");
const cors = require("cors");
const { authRouter } = require("./routes/authRoutes");
const { roomRouter } = require("./routes/roomRoutes");
const { mongodb } = require("./mongodb/mongodb");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const { setupSocketIO } = require("./controllers/room_controllers");

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

// app.get("/socket.io/socket.io.js", (req, res) => {
//   res.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.js");
// });

app.use("/auth", authRouter);
app.use("/rooms", roomRouter);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

setupSocketIO(io);
// io.on("connection", async (socket) => {
//   console.log("User connected");

//   socket.on("message", (message) => {
//     socket.broadcast.emit("message", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
