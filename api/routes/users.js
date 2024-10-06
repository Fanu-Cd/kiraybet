const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../services/email");

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

router.get("/get-all", function (req, response, next) {
  User.find().then((res) => {
    response.status(200).json({ data: res });
  });
});

router.get("/get-by-id/:id", function (req, response, next) {
  const id = req.params.id;
  User.findById(id).then((res) => {
    response.status(200).json({ data: res });
  });
});

router.get("/get-by-email/:email", function (req, response, next) {
  const { email } = req.params;
  User.findOne({ email }).then((res) => {
    response.status(200).json({ data: res });
  });
});

router.get("/get-by-phone/:pnumber", function (req, response, next) {
  const { pnumber } = req.params;
  User.findOne({ phoneNumber: pnumber }).then((res) => {
    response.status(200).json({ data: res });
  });
});

router.post("/create-new", async function (req, response, next) {
  const { fname, lname, email, pass, accountType, pnumber } = req.body;
  const hashedPassword = await hashPassword(pass);
  const newUser = new User({
    fname,
    lname,
    email,
    password: hashedPassword,
    accountType,
    accountStatus: "pending",
    phoneNumber: pnumber,
  });
  newUser
    .save()
    .then((res) => {
      response.status(200).json({ data: res });
    })
    .catch((err) => {
      response.status(400).send(err);
    });
});

router.post(
  "/send-verification-email/:email",
  async function (req, response, next) {
    const { email } = req.params;
    console.log("email", email);

    const { code } = req.body;
    const subject = "Email Verification";
    const text = "This is your code : " + code;
    const result = await sendEmail(email, subject, text);
    if (result.success) {
      return response.status(200).send("Email Sent");
    } else {
      return response.status(400).send("Some Error Occurred");
    }
  }
);

module.exports = router;
