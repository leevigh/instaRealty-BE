const express = require("express");
const router = express.Router();
const cors = require('cors');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const { getBookings, addBooking } = require("../controllers/bookings");

router.get('/', auth, getBookings)
router.post('/:rentalId', auth, addBooking)

module.exports = router;
