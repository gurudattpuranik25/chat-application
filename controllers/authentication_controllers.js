const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");
const UserSessions = require("../models/userSessionModel");

const validateUserCredentials = (name, email, password) => {
  if (!(name && email && password)) {
    return "All fields are mandatory.";
  }

  if (!validator.isEmail(email)) {
    return "Enter a valid email address.";
  }

  if (password.length < 6) {
    return "Password should have a minimum of 6 characters.";
  }

  return true;
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const checkValidUser = validateUserCredentials(name, email, password);
  if (checkValidUser !== true) {
    return res.json({ error: checkValidUser });
  } else {
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.json({
          error: `User with an email ${email} already exists.`,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ name, email, password: hashedPassword })
        .then(() => {
          return res.json({ success: "User created" });
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const isActiveUser = await UserSessions.findOne({ sessionID: email });
  if (isActiveUser) {
    return res.json({
      error: "You are already logged in, kindly continue with the session.",
    });
  }
  if (!(email && password)) {
    return res.json({ error: "Email and password are mandatory." });
  }
  if (!validator.isEmail(email)) {
    return res.json({ error: "Enter a valid email address." });
  }
  const userExists = await User.findOne({ email });
  if (!userExists) {
    return res.json({ error: "User not found." });
  }
  try {
    const decodedPassword = await bcrypt.compare(password, userExists.password);
    if (userExists.email === email && decodedPassword) {
      const accessToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      const cookieOptions = {
        httpOnly: true,
      };
      await UserSessions.create({ sessionID: email, accessToken })
        .then(() => {})
        .catch((err) => res.json({ error: err }));
      return res
        .cookie("accessToken", accessToken, cookieOptions)
        .json({ success: "Login successful.", accessToken });
    } else {
      return res.json({
        error: `Invalid login credentials.`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ error: "Email ID is mandatory." });
  }
  if (!validator.isEmail(email)) {
    return res.json({ error: "Enter a valid email address." });
  }
  const loggedInUser = await UserSessions.findOne({ sessionID: email });
  if (loggedInUser) {
    await UserSessions.deleteOne({ sessionID: email })
      .then(() => {
        return res.json({ success: "Logout successful." });
      })
      .catch((err) => {
        return res.json({ error: err });
      });
  } else {
    return res.json({ error: "User is not logged in." });
  }
};

module.exports = { register, login, logout };
