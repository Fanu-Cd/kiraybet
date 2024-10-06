const nodemailer = require("nodemailer");
require("dotenv").config(); // If you're using environment variables
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.NODE_MAILER_CLIENT_ID,
  process.env.NODE_MAILER_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.NODE_MAILER_REFRESH_TOKEN,
});

const accessToken = new Promise((resolve, reject) => {
  oauth2Client.getAccessToken((err, token) => {
    if (err) {
      console.log({ error: err });
    }
  });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.NODE_MAILER_EMAIL,
    accessToken,
    clientId: process.env.NODE_MAILER_CLIENT_ID,
    clientSecret: process.env.NODE_MAILER_CLIENT_SECRET,
    refreshToken: process.env.NODE_MAILER_REFRESH_TOKEN,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.NODE_MAILER_EMAIL,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.log("Error sending email: ", error);
    return { success: false, message: "Error sending email" };
  }
};

module.exports = { sendEmail };
