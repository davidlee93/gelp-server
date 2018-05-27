"use strict";
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  zipcode: {
    type: Number,
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ratings" }]
});

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    created: this.created || "",
    firstName: this.firstName || "",
    lastName: this.lastName || "",
    email: this.email || "",
    zipcode: this.zipcode || "",
    ratings: this.ratings || ""
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model("User", UserSchema);

module.exports = { User };
