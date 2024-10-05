const express = require("express");
const router = express.Router();
const ChatInstance = require("../models/chat-instance");
const { default: mongoose } = require("mongoose");
router.get("/get-all", function (req, response, next) {
  ChatInstance.find().then((res) => {
    response.status(200).json({ data: res });
  });
});

router.post("/create-new", async function (req, response, next) {
  const data = req.body;
  const newChatInstance = new ChatInstance(data);

  newChatInstance
    .save()
    .then((res) => {
      response.status(200).json({ data: res });
    })
    .catch((err) => {
      response.status(400).send(err);
    });
});

router.get("/get-by-id/:id", function (req, response, next) {
  const id = req.params.id;
  ChatInstance.findById(id)
    .populate("user1Id")
    .populate("user2Id")
    .populate("houseId")
    .then((res) => {
      response.status(200).json({ data: res });
    });
});

router.get("/get-by-user-id/:id", function (req, response, next) {
  let id = req.params.id;
  id = new mongoose.Types.ObjectId(id);
  ChatInstance.find({
    $or: [{ user1Id: id }, { user2Id: id }],
  })
    .populate("user1Id")
    .populate("user2Id")
    .populate("houseId")
    .then((res) => {
      response.status(200).json({ data: res });
    })
    .catch((err) => {
      console.log("error", err);
      response.status(404).send("Error");
    });
});

router.get(
  "/get-by-users-and-house-id/:id1/:id2/:houseId",
  function (req, response, next) {
    const { id1, id2, houseId } = req.params;
    ChatInstance.findOne({
      houseId,
      $or: [
        { user1Id: id1 },
        { user2Id: id1 },
        { user1Id: id2 },
        { user2Id: id2 },
      ],
    })
      .populate("user1Id")
      .populate("user2Id")
      .populate("houseId")
      .then((res) => {
        response.status(200).json({ data: res });
      })
      .catch((err) => {
        console.log("error", err);
        response.status(404).send("Error");
      });
  }
);

router.put("/update/:id", async function (req, response, next) {
  const chatInstanceId = req.params.id;
  const existingChatInstance = ChatInstance.findById(chatInstanceId);
  await ChatInstance.updateOne(
    { _id: chatInstanceId },
    { $set: existingChatInstance }
  );
  response.status(200).send("Successfully updated");
});

router.delete("/delete/:id", (req, response) => {
  const { id } = req.params;
  ChatInstance.findOneAndDelete({ _id: id })
    .then((res) => {
      response.status(200).send("Deleted Successfully");
    })
    .catch((err) => {
      response.status(400).send("Some Erorr Occurred");
    });
});

module.exports = router;
