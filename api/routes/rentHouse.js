const express = require("express");
const router = express.Router();
const User = require("../models/user");
const RentHouse = require("../models/rentHouse");
const Rating = require("../models/rating");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { default: mongoose } = require("mongoose");
router.get("/get-all", function (req, response, next) {
  RentHouse.find().then((res) => {
    response.status(200).json({ data: res });
  });
});

// Helper function to assign levels
function assignLevels(data, field) {
  data.sort((a, b) => b[field] - a[field]);
  const levels = {};
  let level = 1;
  let previousValue = null;

  data.forEach((item, index) => {
    if (item[field] !== previousValue) {
      level = index + 1;
    }
    levels[item._id] = level;
    previousValue = item[field];
  });

  return levels;
}

router.get(
  "/get-rent-house-statistics-by-ownerId/:ownerId",
  async function (req, response, next) {
    try {
      const { ownerId } = req.params;

      const housesData = await RentHouse.aggregate([
        { $group: { _id: "$ownerId", count: { $sum: 1 } } },
      ]);

      const ratingData = await Rating.aggregate([
        { $group: { _id: "$ownerId", avgRating: { $avg: "$rating" } } },
      ]);

      const housesLevels = assignLevels(housesData, "count");
      const ratingLevels = assignLevels(ratingData, "avgRating");

      const ownerHousesLevel = housesLevels[ownerId] || housesLevels.length;
      const ownerRatingLevel = ratingLevels[ownerId] || ratingLevels.length;

      response.json({
        houses: ownerHousesLevel,
        rating: ownerRatingLevel,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Server Error" });
    }
  }
);

router.get("/get-by-id/:id", function (req, response, next) {
  const id = req.params.id;
  RentHouse.findById(id)
    .populate("ownerId")
    .then((res) => {
      response.status(200).json({ data: res });
    });
});

router.get("/get-by-owner-id/:id", function (req, response, next) {
  let id = req.params.id;
  id = new mongoose.Types.ObjectId(id);
  RentHouse.find({ ownerId: id }).then((res) => {
    response.status(200).json({ data: res });
  });
});

router.get("/get-by-subcity/:subcity", function (req, response, next) {
  let subcity = req.params.subcity;
  RentHouse.find({ "location.text": subcity }).then((res) => {
    response.status(200).json({ data: res });
  });
});

const rentHouseStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/rent-houses"); // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Customize file name
  },
});

const upload = multer({ storage: rentHouseStorage });

router.post(
  "/create-new",
  upload.array("files", 5),
  async function (req, response, next) {
    console.log("req", req.body);

    const mediaFilePath = req.files.map((file) => file.path);
    const data = {
      ...req.body,
      location: JSON.parse(req.body.location),
      mediaFilePath,
    };
    const newRentHouse = new RentHouse(data);

    newRentHouse
      .save()
      .then((res) => {
        response.status(200).json({ data: res });
      })
      .catch((err) => {
        response.status(400).send(err);
      });
  }
);

router.post("/delete-media/:id", async function (req, response, next) {
  const { id } = req.params;
  const { fileName } = req.body;
  const filePath = path.join(__dirname, "../uploads/rent-houses", fileName);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log("err", err);
      response.status(400).send("File Not Found");
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        response.status(400).send("Can't delete file");
      }

      RentHouse.findOneAndUpdate(
        { _id: id },
        { $pull: { mediaFilePath: `uploads\\rent-houses\\${fileName}` } },
        { new: true }
      )
        .then((res) => {
          response.status(200).send("File Deleted Successfully");
        })
        .catch((err) => {
          response.status(400).send("Can't delete file");
        });
    });
  });
});

router.put(
  "/update/:id",
  upload.array("files", 5),
  async function (req, response, next) {
    const houseId = req.params.id;
    const {
      title,
      type,
      size,
      beds,
      maxPeople,
      price,
      isNegotiable,
      isAvailable,
    } = req.body;

    try {
      let existingHouse = await RentHouse.findById(houseId);

      if (!existingHouse) {
        return response.status(404).send("House Not Found");
      }

      existingHouse.title = title || existingHouse.title;
      existingHouse.type = type || existingHouse.type;
      existingHouse.size = size || existingHouse.size;
      existingHouse.beds = beds || existingHouse.beds;
      existingHouse.maxPeople = maxPeople || existingHouse.maxPeople;
      existingHouse.price = price || existingHouse.price;
      existingHouse.isNegotiable =
        isNegotiable !== undefined ? isNegotiable : existingHouse.isNegotiable;
      existingHouse.isAvailable =
        isAvailable !== undefined ? isAvailable : existingHouse.isAvailable;

      if (req.files && req.files.length > 0) {
        const uploadedFilesPaths = req.files.map((file) => file.path); //
        existingHouse.mediaFilePath = [
          ...existingHouse.mediaFilePath,
          ...uploadedFilesPaths,
        ];
      }

      await RentHouse.updateOne({ _id: houseId }, { $set: existingHouse });
      response.status(200).send("Successfully updated");
    } catch (err) {
      return response.status(404).send("Some Error Occurred");
    }
  }
);

router.delete("/delete/:id", (req, response) => {
  const { id } = req.params;
  RentHouse.findOneAndDelete({ _id: id })
    .then((res) => {
      response.status(200).send("Deleted Successfully");
    })
    .catch((err) => {
      response.status(400).send("Some Erorr Occurred");
    });
});

module.exports = router;
