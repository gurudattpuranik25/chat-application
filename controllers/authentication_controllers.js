const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");
const UserSessions = require("../models/userSessionModel");

// validate user credentials
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

// user regsiter controller
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const checkValidUser = validateUserCredentials(name, email, password);
  if (checkValidUser !== true) {
    return res.status(400).json({ error: checkValidUser });
  } else {
    try {
      // check if the user is already registered
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(406).json({
          error: `User with an email ${email} already exists.`,
        });
      }

      // hash password and create a user in the database
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ name, email, password: hashedPassword })
        .then(() => {
          return res.status(201).json({ success: "User created" });
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }
};

// user login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  // check is the user is already logged in
  const isActiveUser = await UserSessions.findOne({ sessionID: email });
  if (isActiveUser) {
    return res.status(409).json({
      error: "You are already logged in, kindly continue with the session.",
    });
  }

  // validate user credentials
  if (!(email && password)) {
    return res.status(400).json({ error: "Email and password are mandatory." });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  const userExists = await User.findOne({ email });
  if (!userExists) {
    return res.status(406).json({ error: "User not found." });
  }
  try {
    // user login
    const decodedPassword = await bcrypt.compare(password, userExists.password);
    if (userExists.email === email && decodedPassword) {
      const serializeUser = userExists.toJSON();
      delete serializeUser.password;
      const accessToken = jwt.sign(serializeUser, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      const cookieOptions = {
        httpOnly: true,
      };
      // add the user in sessions collection and generate an access token
      await UserSessions.create({ sessionID: email, accessToken })
        .then(() => {})
        .catch((err) => res.json({ error: err }));
      return res
        .cookie("accessToken", accessToken, cookieOptions)
        .status(200)
        .json({ success: "Login successful.", accessToken });
    } else {
      return res.status(400).json({
        error: `Invalid login credentials.`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// logout controller
const logout = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email ID is mandatory." });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  // delete user session
  const loggedInUser = await UserSessions.findOne({ sessionID: email });
  if (loggedInUser) {
    await UserSessions.deleteOne({ sessionID: email })
      .then(() => {
        return res.status(200).json({ success: "Logout successful." });
      })
      .catch((err) => {
        return res.status(400).json({ error: err });
      });
  } else {
    return res.status(401).json({ error: "User is not logged in." });
  }
};

module.exports = { register, login, logout };
