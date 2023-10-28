const express = require("express");
const { router } = require("./routes/routes");
const { mongodb } = require("./mongodb/mongodb");

const PORT = 3000;

const app = express();

mongodb();

app.use(express.json());
app.use("/auth", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
