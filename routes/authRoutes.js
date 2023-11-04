const { Router } = require("express");
const {
  register,
  login,
  logout,
} = require("../controllers/authentication_controllers");

const authRouter = Router();

// authentication routes
authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

module.exports = { authRouter };
