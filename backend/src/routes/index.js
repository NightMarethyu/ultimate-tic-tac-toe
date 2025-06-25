var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.json({ message: "Welcome to the API", status: "running" });
});

module.exports = router;
