var express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { createRental } = require('../controllers/rentals');
var router = express.Router();

router.post('/', createRental)

module.exports = router;
