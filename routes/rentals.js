var express = require("express");
var router = express.Router();
const cors = require('cors');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { getRentals, getRental, createRental, edit_rental, delete_rental, review_rental, rentPay } = require('../controllers/rentals');
const upload = require('../configs/multer');

router.get('/', getRentals);

router.get('/:id', getRental);

router.post("/", auth, upload.single("propertyPhotos"), createRental);

router.patch("/edit/:rentalId", auth, edit_rental);

router.post("/:id/review", auth, review_rental);

router.delete("/delete/:rentalId", auth, delete_rental);

router.post("/:id/payment", auth, rentPay);

module.exports = router;
