const { Router } = require("express");
const {
  register,
  login,
} = require("../controllers/authentication_controllers");

const router = Router();

router.post("/register", register);
router.post("/login", login);

module.exports = { router };
