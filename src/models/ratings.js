"use strict";
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const RatingSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  restId: {
    type: String,
    required: true
  },
  userFirstName: {
    type: String,
    required: true
  },
  userLastName: {
    type: String,
    required: true
  },
  userZipcode: {
    type: Number,
    required: true
  },
  userCreated: {
    type: Date,
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  quality: {
    type: Number,
    required: true
  },
  pricing: {
    type: Number,
    required: true
  },
  textarea: {
    type: String,
    required: true
  }
  // [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }]
});

RatingSchema.methods.serialize = function() {
  return {
    id: this._id,
    userId: this.userId,
    userFirstName: this.userFirstName,
    userLastName: this.userLastName,
    userZipcode: this.userZipcode,
    userCreated: this.userCreated,
    restId: this.restId,
    created: this.created,
    quantity: this.quantity,
    quality: this.quality,
    pricing: this.pricing,
    textarea: this.textarea
  };
  // TODO -- Rating data will need to go here
};

const Rating = mongoose.model("Rating", RatingSchema);

module.exports = { Rating };
