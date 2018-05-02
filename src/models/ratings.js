const mongoose = require('mongoose');

const ratingsSchema = mongoose.Schema({
  userId: { type: String },
  created: { type: Date, default: Date.now, required: true },
  date: { type: String, required: true },
  Restaurant: { type: String, required: true },
  ratings: { type: Number, required: true },
  comment: { type: String }
});

const Ratings = mongoose.model('Ratings', ratingsSchema);

module.exports = { Ratings };