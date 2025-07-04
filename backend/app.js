require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const cors = require("cors");

const indexRouter = require("./routes/index");
const testRouter = require("./routes/testapi");
const usersRouter = require("./routes/users");
const gamesRouter = require("./routes/games");

const app = express();
const PORT = process.env.PORT || 5000;

// It's crucial to specify the origin for security in production
const isDevelopment = process.env.NODE_ENV === "development";
const allowedOrigins = isDevelopment ? "http://localhost:3500" : "none";

const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // This allows cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", indexRouter);
app.use("/testapi", testRouter);
app.use("/users", usersRouter);
app.use("/games", gamesRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;
