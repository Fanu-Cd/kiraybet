const express = require("express");
const router = express.Router();
const SavedHouse = require("../models/saved-house");
const { default: mongoose } = require("mongoose");
router.get("/get-all", function (req, response, next) {
  SavedHouse.find()
    .populate("userId")
    .populate("houseId")
    .then((res) => {
      response.status(200).json({ data: res });
    });
});

router.post("/create-new", async function (req, response, next) {
  const data = req.body;
  const saveNewHouse = new SavedHouse(data);

  saveNewHouse
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
  SavedHouse.findById(id)
    .populate("userId")
    .populate("houseId")
    .then((res) => {
      response.status(200).json({ data: res });
    });
});

router.get("/get-by-user-id/:id", function (req, response, next) {
  const id = req.params.id;

  SavedHouse.find({ userId: new mongoose.Types.ObjectId(id) })
    .populate("userId")
    .populate("houseId")
    .then((res) => {
      response.status(200).json({ data: res });
    });
});

router.get(
  "/get-by-user-and-house-id/:userId/:houseId",
  function (req, response, next) {
    const { userId, houseId } = req.params;

    SavedHouse.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      houseId: new mongoose.Types.ObjectId(houseId),
    })
      .populate("userId")
      .populate("houseId")
      .then((res) => {
        response.status(200).json({ data: res });
      });
  }
);

router.delete("/delete/:id", (req, response) => {
  const { id } = req.params;
  SavedHouse.findOneAndDelete({ _id: id })
    .then((res) => {
      response.status(200).send("Removed Successfully");
    })
    .catch((err) => {
      response.status(400).send("Some Erorr Occurred");
    });
});

module.exports = router;
