const express = require("express");
const { ensureAuthenticated } = require("../config/auth");
const router = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
  res.send("Welcome");
});

module.exports = router;
