var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { getRentals, getRental, createRental, edit_rental, delete_rental } = require('../controllers/rentals');
const upload = require('../configs/multer')

router.get('/', getRentals);

router.get('/:id', getRental);

router.post('/', auth, upload.array('propertyPhotos',6), createRental)

router.patch("/edit/:rentalId", auth, edit_rental);

router.delete("/delete/:rentalId", auth, delete_rental);



module.exports = router;
