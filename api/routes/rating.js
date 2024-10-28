const express = require("express");
const router = express.Router();
const Rating = require("../models/rating");
const RentHouse = require("../models/rentHouse");

const { default: mongoose } = require("mongoose");
router.get("/get-all", function (req, response, next) {
  Rating.find()
    .populate("houseId")
    .populate("userId")
    .populate("ownerId")
    .then((res) => {
      response.status(200).json({ data: res });
    });
});

router.post("/create-new", async function (req, response, next) {
  const { userId, ownerId, houseId, rateExists, value } = req.body;
  if (rateExists) {
    await Rating.deleteMany({ userId, ownerId, houseId });
  }

  const otherRatings = await Rating.find({ ownerId, houseId });
  const totalOldRatings = otherRatings?.reduce(
    (acc, item) => acc + item.rating,
    0
  );
  const newRating = new Rating({ userId, ownerId, houseId, value });
  const newTotalRating = (totalOldRatings + value) / (otherRatings?.length + 1);

  newRating
    .save()
    .then(async (res) => {
      await RentHouse.findByIdAndUpdate(houseId, { rating: newTotalRating });
      response.status(200).json({ data: res });
    })
    .catch((err) => {
      response.status(400).send(err);
    });
});

router.get("/get-by-id/:id", function (req, response, next) {
  const id = req.params.id;
  Rating.findById(id)
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
  Rating.find({})
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
    Rating.find({ houseId, ownerId })
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

router.get(
  "/get-by-house-and-user-id/:houseId/:userId",
  function (req, response, next) {
    const { userId, houseId } = req.params;
    Rating.find({ houseId, userId })
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
  const existingChatInstance = Rating.findById(chatInstanceId);
  await ChatInstance.updateOne(
    { _id: chatInstanceId },
    { $set: existingChatInstance }
  );
  response.status(200).send("Successfully updated");
});

router.delete("/delete/:id", (req, response) => {
  const { id } = req.params;
  Rating.findOneAndDelete({ _id: id })
    .then((res) => {
      response.status(200).send("Deleted Successfully");
    })
    .catch((err) => {
      response.status(400).send("Some Erorr Occurred");
    });
});

module.exports = router;
