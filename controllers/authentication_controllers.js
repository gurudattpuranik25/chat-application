const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!(name && email && password)) {
    return res.json({ error: "All fields are mandatory." });
  } else if (!validator.isEmail(email)) {
    return res.json({ error: "Enter a valid email address." });
  } else if (password.length < 6) {
    return res.json({
      error: "Password should have a minimum of 6 characters.",
    });
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
  if (!(email && password)) {
    return res.json({ error: "Email and password are mandatory." });
  } else if (!validator.isEmail(email)) {
    return res.json({ error: "Enter a valid email address." });
  } else {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.json({ error: "User not found." });
    }
    try {
      const decodedPassword = await bcrypt.compare(
        password,
        userExists.password
      );
      if (userExists.email === email && decodedPassword) {
        const accessToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1h",
        });
        const cookieOptions = {
          httpOnly: true,
        };
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
  }
};

module.exports = { register, login };
