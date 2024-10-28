const express = require("express");
const router = express.Router();
const Complaint = require("../models/complaint");
const { default: mongoose } = require("mongoose");
router.get("/get-all", function (req, response, next) {
  Complaint.find()
    .populate("houseId")
    .populate("userId")
    .populate("ownerId")
    .then((res) => {
      response.status(200).json({ data: res });
    });
});

router.post("/create-new", async function (req, response, next) {
  const data = req.body;
  const newComplaint = new Complaint(data);

  newComplaint
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
  Complaint.findById(id)
    .populate("houseId")
    .populate("userId")
    .populate("ownerId")
    .then((res) => {
      response.status(200).json({ data: res });
    });
});

router.get("/get-by-owner-id/:ownerId", function (req, response, next) {
  let id = req.params.ownerId;
  id = new mongoose.Types.ObjectId(id);
  Complaint.find({})
    .populate("houseId")
    .populate("userId")
    .populate("ownerId")
    .then((res) => {
      response.status(200).json({ data: res });
    })
    .catch((err) => {
      console.log("error", err);
      response.status(404).send("Error");
    });
});

router.get(
  "/get-by-house-and-owner-id/:houseId/:ownerId",
  function (req, response, next) {
    const { ownerId, houseId } = req.params;
    Complaint.findOne({ houseId, ownerId })
      .populate("ownerId")
      .populate("houseId")
      .populate("userId")
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
  const existingChatInstance = Complaint.findById(chatInstanceId);
  await ChatInstance.updateOne(
    { _id: chatInstanceId },
    { $set: existingChatInstance }
  );
  response.status(200).send("Successfully updated");
});

router.delete("/delete/:id", (req, response) => {
  const { id } = req.params;
  Complaint.findOneAndDelete({ _id: id })
    .then((res) => {
      response.status(200).send("Deleted Successfully");
    })
    .catch((err) => {
      response.status(400).send("Some Erorr Occurred");
    });
});

module.exports = router;
