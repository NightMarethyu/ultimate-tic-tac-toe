const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  res.send("API is working properly");
});

module.exports = router;
