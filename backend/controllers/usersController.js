const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const hashPassword = require("../helpers/hash");
const asyncHandler = require("express-async-handler");
const jwtAuthenticate = require("../auth/auth").jwtAuthenticate;

// GET request to get a list of all users
// Only accessible by admin users
exports.users_list = asyncHandler(async (req, res, next) => {
  const users = await Users.find();
  for (let user of users) {
    user = user.toObject();
    delete user.password; // Remove password from the response
  }
  res.json(users);
});

// POST request to create a new user
exports.users_create_post = asyncHandler(async (req, res, next) => {
  try {
    var userData = req.body;
    userData.password = await hashPassword(userData.password);
    const user = new Users(userData);
    await user.save();

    const userObject = user.toObject();
    delete userObject.password; // Remove password from the response
    res.status(201).json(userObject);
  } catch (err) {
    if (err.name === "MongoServerError" && err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
});

// POST request to authenticate a user
exports.users_login_post = asyncHandler(async (req, res, next) => {
  const { token } = await jwtAuthenticate(req);
  res.status(200).json({
    token: token,
    username: req.body.username,
  });
});

exports.users_delete = asyncHandler(async (req, res, next) => {
  const user = await Users.findByIdAndDelete(req.params.id);
  res.json({
    message: "User deleted successfully",
    user: user,
  });
});
