const mongoose = require("mongoose");

const savedHouseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    houseId: { type: mongoose.Types.ObjectId, ref: "Rent-House" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Saved-House", savedHouseSchema);
