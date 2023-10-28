const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!(name && email && password)) {
    res.json({ error: "All fields are mandatory." });
    return;
  } else if (!validator.isEmail(email)) {
    res.json({ error: "Enter a valid email address." });
    return;
  } else if (password.length < 6) {
    res.json({ error: "Password should have a minimum of 6 characters." });
    return;
  } else {
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.json({
          error: `User with the email ${email} already exists in the database.`,
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      User.create({ name, email, password: hashedPassword })
        .then(() => {
          res.json({ success: "User created" });
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
    res.json({ error: "Email and password are mandatory." });
    return;
  } else if (!validator.isEmail(email)) {
    res.json({ error: "Enter a valid email address." });
    return;
  } else {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      res.json({ error: "User not found." });
      return;
    }
    try {
      const decodedPassword = await bcrypt.compare(
        password,
        userExists.password
      );
      if (userExists.email === email && decodedPassword) {
        res.json({
          success: `Login successfull.`,
        });
        return;
      } else {
        res.json({
          error: `Invalid login credentials.`,
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = { register, login };
