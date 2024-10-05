const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/login", async function (req, response, next) {
  const { email, pass } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    response.status(400).send("User Not Found");
  }

  const match = await bcrypt.compare(pass, user.password);

  if (!match) {
    response.status(400).send("Incorrect password");
    return;
  }
  response.status(200).json({ data: user });
});

module.exports = router;
