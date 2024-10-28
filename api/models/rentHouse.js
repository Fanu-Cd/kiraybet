const mongoose = require("mongoose");

const rentHouseSchema = new mongoose.Schema(
  {
    title: String,
    type: String,
    size: String,
    beds: String,
    price: String,
    maxPeople: mongoose.Schema.Types.Mixed,
    mediaFilePath: [String],
    location: {
      latitude: Number,
      longitude: Number,
      text: String,
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    isNegotiable: Boolean,
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rent-House", rentHouseSchema);
