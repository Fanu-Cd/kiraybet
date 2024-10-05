const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: String,
    password: String,
    accountType: String,
    phoneNumber: String,
    accountStatus: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
