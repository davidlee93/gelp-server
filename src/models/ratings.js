'use strict'
const mongoose = require('mongoose');

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
  created: { 
    type: Date,
    default: Date.now,
    required: true 
  },
  rating: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }]
});

RatingSchema.methods.serialize = function() {
  return {
    id: this._id,
    // TODO -- Rating data will need to go here
  };
};

const Rating = mongoose.model('Rating', RatingSchema);

module.exports = { Rating };