var express = require("express");
var router = express.Router();
require("dotenv").config();
const recaptchaKey = process.env.GOOGLE_RECAPTCHA_KEY;

router.post("/verify-recaptcha", async function (req, response, next) {
  const token = req.body.token;
  const secretKey = recaptchaKey;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await res.json();
    const { success } = data;

    if (success) {
      response.status(200).send({ message: "Human verified" });
    } else {
      response.status(400).send({
        message: "Verification failed",
        errorCodes: data["error-codes"],
      });
    }
  } catch (error) {
    response.status(500).send({ message: "Error verifying reCAPTCHA", error });
  }
});

module.exports = router;
