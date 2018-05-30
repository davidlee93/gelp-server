"use strict";
const express = require("express");

const bodyParser = require("body-parser");

const { Rating } = require("../models/ratings");

const ratingRouter = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new user
ratingRouter.post("/", jsonParser, (req, res) => {
  const requiredFields = [
    "userId",
    "restId",
    "userFirstName",
    "userLastName",
    "userZipcode",
    "userCreated",
    "quality",
    "quantity",
    "pricing",
    "textarea"
  ];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing field",
      location: missingField
    });
  }
  let {
    userId,
    restId,
    userFirstName,
    userLastName,
    userZipcode,
    userCreated,
    quantity,
    quality,
    pricing,
    textarea
  } = req.body;
  return Rating.find({
    $and: [{ userId: userId }, { restId: restId }]
  })
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing rating by a user
        return Promise.reject({
          code: 422,
          reason: "ValidationError",
          message: "Restaurant already rated by you.",
          location: "rating"
        });
      }
      // If there is no existing user, hash the password
      return Rating.create({
        userId,
        restId,
        userFirstName,
        userLastName,
        userZipcode,
        userCreated,
        quantity,
        quality,
        pricing,
        textarea
      });
    })
    .then(user => {
      const message = { message: `Successfully created user rating` };
      return res.status(201).json(message);
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

ratingRouter.get("/place/:restId", (req, res) => {
  return Rating.find({ restId: req.params.restId })
    .then(ratings => {
      res.json(ratings.map(rating => rating.serialize()));
    })
    .catch(err => {
      res.status(500).json({ message: "Internal server error" });
    });
});

ratingRouter.get("/findings", (req, res) => {
  const places = req.query.places;
  return Rating.aggregate([
    {
      $match: {
        restId: {
          $in: places
        }
      }
    },
    {
      $group: {
        _id: "$restId",
        avgPricing: { $avg: "$pricing" },
        avgQuantity: { $avg: "$quantity" },
        avgQuality: { $avg: "$quality" },
        count: { $sum: 1 }
      }
    }
  ])
    .allowDiskUse(true)
    .exec()
    .then(ratings => {
      res.json(ratings.map(rating => rating));
    })
    .catch(err => {
      res.status(500).json({ message: "Internal server error" });
    });
});

ratingRouter.get("/user/:userId", (req, res) => {
  return Rating.find({ userId: req.params.userId })
    .then(ratings => {
      res.json(ratings.map(rating => rating.serialize()));
    })
    .catch(err => {
      res.status(500).json({ message: "Internal server error" });
    });
});

// USED FOR TESTING
ratingRouter.get("/", (req, res) => {
  return Rating.find()
    .then(ratings => {
      res.status(200).json({ message: "hit all ratings" });
    })
    .catch(err => {
      res.status(500).json({ message: "Internal server error" });
    });
});

module.exports = { ratingRouter };
