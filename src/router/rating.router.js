'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Rating} = require('../models/ratings');

const ratingRouter = express.Router();

const jsonParser = bodyParser.json();
var logger = require("morgan");
// Post to register a new user
ratingRouter.post('/', jsonParser, (req, res) => {
  const requiredFields = ['userId', 'restId', 'rating'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
  let {userId, restId, ratings} = req.body;
  return User.find({
    $and: [
      {"userId": userId},
      {"restId": restId}
    ]
  })
  .count()
  .then(count => {
    if (count > 0) {
      // There is an existing rating by a user
      return Promise.reject({
        code: 422,
        reason: 'ValidationError',
        message: 'Restaurant already rated by user',
        location: 'rating'
      });
    }
    // If there is no existing user, hash the password
    return User.create({
      userId,
      restId,
      rating
    })
  })
  .then(user => {
    const message = { message: `Successfully created user rating`}
    return res.status(201).json(message);
  })
  .catch(err => {
    // Forward validation errors on to the client, otherwise give a 500
    // error because something unexpected has happened
    if (err.reason === 'ValidationError') {
      return res.status(err.code).json(err);
    }
    res.status(500).json({code: 500, message: 'Internal server error'});
  });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
ratingRouter.get('/', (req, res) => {
  return Rating.find(req.body.userId)
    .then(ratings => res.json(rating.map(rating => rating.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {ratingRouter};