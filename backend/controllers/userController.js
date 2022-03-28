const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { use } = require("express/lib/router");
const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");

// @desc Register a new user
// @route /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  // Find if user already exists
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Login an existing user
// @route /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  res.send("Login route");
});

module.exports = {
  registerUser,
  loginUser,
};
