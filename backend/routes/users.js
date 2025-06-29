const express = require("express");
const router = express.Router();

const users_controller = require("../controllers/usersController");
const jwtAuthorize = require("../auth/auth").jwtAuthorize;
const isAdmin = require("../auth/auth").isAdmin;
const isUserOrAdmin = require("../auth/auth").isUserOrAdmin;

// Get users listing, if admin only
router.get("/", jwtAuthorize, isAdmin, users_controller.users_list);

// Post request to create a new user
router.post("/signup", users_controller.users_create_post);

// POST request to authenticate a user
router.post("/login", users_controller.users_login_post);

// DELETE request to delete a user by ID, if ID === req.user._id or admin
router.delete(
  "/:id",
  jwtAuthorize,
  isUserOrAdmin,
  users_controller.users_delete
);

module.exports = router;
