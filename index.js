const express = require("express");
const { router } = require("./routes/routes");
const { mongodb } = require("./mongodb/mongodb");
const cookieParser = require("cookie-parser");

const PORT = 3000;

const app = express();

mongodb();

app.use(express.json());
app.use(cookieParser());
app.use("/auth", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
