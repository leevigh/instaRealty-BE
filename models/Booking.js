const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const bookingSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },

        time: {
            type: Date,
            required: false
        },

        phoneNumber: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        cancelledByRenter: {
            type: Boolean,
            default: false
        },
        cancelledByOwner: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            required: false,
            default: ''
        },
        rental: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rental",
            required: true
        },
        renter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

// rentalSchema.virtual('ratings').get(function() {
//   return this.ratings > 0 ? this.ratings : 0
// })

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
