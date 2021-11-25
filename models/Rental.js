const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const rentalSchema = mongoose.Schema({
  propertyType: {
    type: String,
    required: false,
  },

  address: {
    type: String,
    required: true,
  },

  roomNumber: {
    type: String,
    required: true,
  },

  assets: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  propertyPhotos: {
      type: String,
      required: true,
    },

  rating: {
    type: Number,
    required: false,
  },

  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "User",
  },
});

const Rental = mongoose.model("Rental", rentalSchema);
module.exports = Rental;
