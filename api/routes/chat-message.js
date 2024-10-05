const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/chat-message");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
router.get("/get-all", function (req, response, next) {
  ChatMessage.find()
    .populate("senderId")
    .populate("receiverId")
    .then((res) => {
      response.status(200).json({ data: res });
    });
});

router.post("/create-new", async function (req, response, next) {
  const data = req.body;
  const newChatMessage = new ChatMessage(data);

  newChatMessage
    .save()
    .then((res) => {
      response.status(200).json({ data: res });
    })
    .catch((err) => {
      response.status(400).send(err);
    });
});

const chatFilesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/chat-files"); // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Customize file name
  },
});

const upload = multer({ storage: chatFilesStorage });

router.post("/create-new", async function (req, response, next) {
  const data = req.body;
  const newChatMessage = new ChatMessage(data);

  newChatMessage
    .save()
    .then((res) => {
      response.status(200).json({ data: res });
    })
    .catch((err) => {
      response.status(400).send(err);
    });
});

router.post(
  "/send-files",
  upload.array("files", 5),
  async function (req, response, next) {
    const mediaFilePath = req.files.map((file) => file.path);
    const data = {
      ...req.body,
      message: {
        text: "",
        isText: false,
        mediaFilePath,
      },
    };
    const newMessageChatFile = new ChatMessage(data);

    newMessageChatFile
      .save()
      .then((res) => {
        response.status(200).json({ data: res });
      })
      .catch((err) => {
        response.status(400).send(err);
      });
  }
);

router.get("/get-by-id/:id", function (req, response, next) {
  const id = req.params.id;
  ChatMessage.findById(id)
    .populate("senderId")
    .populate("receiverId")
    .then((res) => {
      response.status(200).json({ data: res });
    });
});

router.get("/get-by-instance-id/:id", function (req, response, next) {
  const id = req.params.id;
  console.log("id", id);

  ChatMessage.find({ chatInstanceId: new mongoose.Types.ObjectId(id) })
    .populate("senderId")
    .populate("receiverId")
    .then((res) => {
      response.status(200).json({ data: res });
    });
});

router.put("/update/:id", async function (req, response, next) {
  const chatMessageId = req.params.id;
  const existingChatMessage = ChatInstance.findById(chatMessageId);
  await ChatInstance.updateOne(
    { _id: chatMessageId },
    { $set: existingChatMessage }
  );
  response.status(200).send("Successfully updated");
});

router.delete("/delete/:id", (req, response) => {
  const { id } = req.params;
  ChatMessage.findOneAndDelete({ _id: id })
    .then((res) => {
      response.status(200).send("Deleted Successfully");
    })
    .catch((err) => {
      response.status(400).send("Some Erorr Occurred");
    });
});

module.exports = router;
