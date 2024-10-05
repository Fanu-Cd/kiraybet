const mongoose = require("mongoose");

const chatInstanceSchema = new mongoose.Schema(
  {
    user1Id: { type: mongoose.Types.ObjectId, ref: "User" },
    user2Id: { type: mongoose.Types.ObjectId, ref: "User" },
    houseId: { type: mongoose.Types.ObjectId, ref: "Rent-House" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat-Instance", chatInstanceSchema);
