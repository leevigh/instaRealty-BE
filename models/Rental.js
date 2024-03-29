const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: false },
    comment: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const rentOrder = mongoose.Schema({
  stripeToken: {
    type: String,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
});

const rentalSchema = mongoose.Schema(
  {
    propertyType: {
      type: String,
      required: false,
    },

    postalCode: {
      type: String,
      required: false,
    },

    city: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
      default: ''
    },

    isAvailable: {
      type: Boolean,
      required: true,
      default: true
    },

    description: {
      type: String,
      required: false,
    },

    price: {
      type: Number,
      required: true,
    },

    roomNumber: {
      type: String,
      required: true,
    },

    assets: {
      type: String,
      required: false
    },

    occupant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    propertyPhotos: [
      {
        type: String,
        required: true,
      }
    ],

    price: {
      type: Number,
      required: true,
    },

    coordinates: {
      type: String,
      required: false
    },
    pluscode: {
      type: String,
      required: false
    },

    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [reviewSchema],
    ratings: {
      type: Number,
      required: false,
      // default: 0,
    },
    numReviews: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

// rentalSchema.virtual('ratings').get(function() {
//   return this.ratings > 0 ? this.ratings : 0
// })

const Rental = mongoose.model("Rental", rentalSchema);
module.exports = Rental;
