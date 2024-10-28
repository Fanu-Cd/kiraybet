const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
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
    comment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
