const express = require("express");
const { authRouter } = require("./routes/authRoutes");
const { roomRouter } = require("./routes/roomRoutes");
const { mongodb } = require("./mongodb/mongodb");
const cookieParser = require("cookie-parser");

const PORT = 3000;

const app = express();

mongodb();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/rooms", roomRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
