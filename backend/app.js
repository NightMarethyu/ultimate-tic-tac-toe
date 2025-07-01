require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
//const mongoose = require("mongoose");
const cors = require("cors");

const indexRouter = require("./routes/index");
const testRouter = require("./routes/testapi");
const usersRouter = require("./routes/users");
const gamesRouter = require("./routes/games");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// remove for testing purposes, moving to the bin/www file
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected..."))
//   .catch((err) => console.error(err));

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
