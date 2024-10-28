const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    houseId: {
      type: mongoose.Types.ObjectId,
      ref: "Rent-House",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    value: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
