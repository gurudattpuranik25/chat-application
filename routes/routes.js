const { Router } = require("express");
const { register } = require("../controllers/authentication_controllers");

const router = Router();

router.post("/register", register);

module.exports = { router };
