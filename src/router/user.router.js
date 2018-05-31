"use strict";
const express = require("express");
const bodyParser = require("body-parser");

const { User } = require("../models/users");

const userRouter = express.Router();

const jsonParser = bodyParser.json();
// Post to register a new user
userRouter.post("/", jsonParser, (req, res) => {
  const requiredFields = [
    "firstname",
    "lastname",
    "email",
    "password",
    "zipcode"
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

  const stringFields = ["firstname", "lastname", "email", "password"];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Incorrect field type: expected string",
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ["firstname", "lastname", "email", "password"];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Cannot start or end with whitespace",
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    email: {
      min: 1
    },
    password: {
      min: 6,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      "min" in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      "max" in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let { email, password, firstname = "", lastname = "", zipcode } = req.body;

  const firstName = firstname.trim();
  const lastName = lastname.trim();
  return User.find({ email })
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 409,
          reason: "ValidationError",
          message: "Email already taken",
          location: "email"
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        email,
        password: hash,
        firstName,
        lastName,
        zipcode
      });
    })
    .then(user => {
      const message = { message: `Successfully created user: ${user.email}` };
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

// Future user pages
// userRouter.get('/', (req, res) => {
//   return User.find(req.body.id)
//     .then(users => res.json(users.map(user => user.serialize())))
//     .catch(err => res.status(500).json({message: 'Internal server error'}));
// });

module.exports = { userRouter };
