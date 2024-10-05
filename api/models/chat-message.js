const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    chatInstanceId: {
      type: mongoose.Types.ObjectId,
      ref: "Chat-Instance",
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    message: {
      text: String,
      isText: {
        type: Boolean,
        default: true,
      },
      isFile: Boolean,
      mediaFilePath: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat-Message", chatMessageSchema);