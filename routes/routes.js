const { Router } = require("express");
const { register } = require("../controllers/authentication_controllers");

const router = Router();

router.get("/register", register);

module.exports = { router };
