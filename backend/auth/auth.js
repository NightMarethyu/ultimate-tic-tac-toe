const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/users");

exports.jwtAuthenticate = async (req) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error(
      "Authentication failed. Invalid username or password."
    );
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return { token, status: 200 };
};

exports.jwtAuthorize = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Unauthorized" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin()) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

exports.isUserOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (req.user.isAdmin() || user._id.equals(req.user._id)) {
      return next();
    } else {
      return res.status(403).json({ message: "Access denied." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.jwtOptional = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (user) {
        req.user = user; // Attach user if found
      }
    } catch (err) {
      // If token is invalid or expired, we don't care.
      // We just won't attach a user.
      console.error("Optional auth error (can be ignored):", err.message);
    }
  }
  next(); // Always proceed to the next middleware/controller
};
